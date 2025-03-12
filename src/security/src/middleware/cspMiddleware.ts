import { NextRequest, NextResponse } from 'next/server';
import { GraphQLRequestClientFactory } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { CSPSettingService } from '../services/cspSettings';
import { CacheOptions, SiteResolver } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  MiddlewareBase,
  MiddlewareBaseConfig,
} from '@constellation4sitecore/constellation-sxa-nextjs/middleware';

export declare type GraphQLRedirectsServiceConfig = {
  /**
   * Override fetch method. Uses 'GraphQLRequestClient' default otherwise.
   */
  fetch?: typeof fetch;
  /**
   * A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
   * This factory function is used to create and configure GraphQL clients for making GraphQL API requests.
   */
  clientFactory: GraphQLRequestClientFactory;
};

export type CSPMiddlewareConfig = Omit<GraphQLRedirectsServiceConfig, 'fetch'> &
  MiddlewareBaseConfig &
  CacheOptions;

export class CSPMiddleware extends MiddlewareBase {
  private cspService: CSPSettingService;
  private siteResolver: SiteResolver;
  constructor(protected config: CSPMiddlewareConfig) {
    super(config);
    this.siteResolver = config.siteResolver;
    this.cspService = new CSPSettingService({
      cacheEnabled: config.cacheEnabled,
      cacheTimeout: config.cacheTimeout,
      clientFactory: config.clientFactory,
      fetch: fetch,
    });
  }

  /**
   * Gets the Next.js middleware handler with error handling
   * @returns route handler
   */
  public getHandler(): (req: NextRequest, res?: NextResponse) => Promise<NextResponse> {
    return async (req, res) => {
      try {
        return await this.handler(req, res);
      } catch (error) {
        console.log('Redirect middleware failed:');
        console.log(error);
        return res || NextResponse.next();
      }
    };
  }

  private handler = async (req: NextRequest, res?: NextResponse): Promise<NextResponse> => {
    const response = res || NextResponse.next();

    if (this.config.disabled?.()) return response;
    // Prerender bypass if cookie is set when prerendering is on preview mode
    // More info: https://nextjs.org/docs/pages/building-your-application/configuring/preview-mode
    if (req.cookies.get('__prerender_bypass')) return response;
    if (req.nextUrl.pathname == '/cspreports.xml') return response;
    const site = this.siteResolver.getByHost((req.headers.get('host') as string) ?? '');
    const forceCacheClear = req.nextUrl.search == '?forceCacheClear=true' ? true : false;
    const cspSettings = await this.cspService.getSettings(
      site.language,
      site.name,
      forceCacheClear
    );
    if (!cspSettings || !cspSettings.cspEnabled.value) return response;
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
      default-src ${cspSettings.defaultSrc.value};
      script-src ${cspSettings.scriptSrc.value.replace('{nonce}', nonce)};
      style-src ${cspSettings.styleSrc.value.replace('{nonce}', nonce)};
      img-src ${cspSettings.imgSrc.value};
      font-src ${cspSettings.fontSrc.value};
      frame-src ${cspSettings.frameSrc.value};
      connect-src ${cspSettings.connectSrc.value};
      object-src ${cspSettings.objectSrc.value};
      base-uri ${cspSettings.baseUri.value};
      form-action ${cspSettings.formAction.value};
      frame-ancestors ${cspSettings.frameAncestors.value};
      ${cspSettings.additionalPolicy.value};
  `;
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(req.headers);
    // Response will be provided if other middleware is run before us (e.g. redirects)
    requestHeaders.set('x-nonce', nonce);

    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    return response;
  };
}
