import {
  DefaultRetryStrategy,
  GraphQLRequestClient,
  GraphQLRequestClientFactory,
} from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { debug as debugers } from '@constellation4sitecore/constellation-sxa-nextjs/debugger';
import { Field, Item } from '@sitecore-jss/sitecore-jss-nextjs';
import { mapToNew } from '@constellation4sitecore/mapper';
import { CacheClient, CacheOptions, MemoryCacheClient } from './cache-client';
import { unstable_cache as cache, revalidateTag } from 'next/cache';
import { TEMPLATES } from '../constants/templates';
import { gql } from 'graphql-tag';

export type CSPSettingServiceConfig = CacheOptions & {
  fetch: typeof fetch;
  clientFactory: GraphQLRequestClientFactory;
};

export type CSPSetting = {
  objectSrc: Field<string>;
  fontSrc: Field<string>;
  frameSrc: Field<string>;
  imgSrc: Field<string>;
  manifestSrc: Field<string>;
  additionalPolicy: Field<string>;
  baseUri: Field<string>;
  connectSrc: Field<string>;
  workerSrc: Field<string>;
  frameAncestors: Field<string>;
  cspEnabled: Field<boolean>;
  defaultSrc: Field<string>;
  scriptSrc: Field<string>;
  mediaSrc: Field<string>;
  styleSrc: Field<string>;
  formAction: Field<string>;
};

type Response = {
  item: Item;
};

export class CSPSettingService {
  private graphQLClient: GraphQLRequestClient;
  private cache: CacheClient<CSPSetting>;

  constructor(private options: CSPSettingServiceConfig) {
    this.graphQLClient = this.getGraphQLClient();
    this.cache = this.getCacheClient();
  }

  private async fetchSettings(language: string, siteName: string): Promise<CSPSetting | null> {
    const siteInfoData = await this.graphQLClient.request<{
      site: { siteInfo: { rootPath: string } };
    }>(
      gql`
        query getSiteInfo($site: String!) {
          site {
            siteInfo(site: $site) {
              rootPath
            }
          }
        }
      `,
      {
        site: siteName,
      }
    );

    if (!siteInfoData.site.siteInfo.rootPath) {
      debugers.security('No root path found for site: %s', siteName);
      return null;
    }

    const settingItemResult = await this.graphQLClient.request<{
      item: { children?: { results?: Item[] } };
    }>(
      gql`
        query getSettingItem($root: String!, $settingTemplate: String!, $language: String!) {
          item(path: $root, language: $language) {
            children(includeTemplateIDs: [$settingTemplate]) {
              results {
                id
                name
                template {
                  id
                }
              }
            }
          }
        }
      `,
      {
        root: `${siteInfoData.site.siteInfo.rootPath}/Settings`,
        settingTemplate: TEMPLATES.CSP_SETTINGS,
        language: language,
      }
    );

    const cspSettingId = settingItemResult.item.children?.results?.[0]?.id;
    if (!cspSettingId) {
      debugers.security(
        'No CSP setting found for site: %s, Please install Constellation.Security module',
        siteName
      );
      console.error(
        'No CSP setting found for site: %s, Please install Constellation.Security module',
        siteName
      );
      return null;
    }

    const query = gql`
      query getCSPSettings($itemId: String!, $language: String!) {
        item(path: $itemId, language: $language) {
          fields {
            name
            jsonValue
          }
        }
      }
    `;
    const data = await this.graphQLClient.request<Response>(query, {
      itemId: cspSettingId,
      language: language,
    });
    const cspSetting = mapToNew<CSPSetting>(data.item as Item);
    return cspSetting;
  }

  async getSettings(
    language: string,
    siteName: string,
    forceCacheClear = false
  ): Promise<CSPSetting | null> {
    const cacheKey = `csp-${siteName}`;
    if (process.env.CONSTELLATION_NEXT_CACHE_ENABLED === 'true') {
      if (forceCacheClear) revalidateTag(cacheKey);
      return await cache(
        async (language, siteName) => this.fetchSettings(language, siteName),
        [language, siteName],
        {
          revalidate: this.options.cacheTimeout,
          tags: [cacheKey],
        }
      )(language, siteName);
    }
    if (forceCacheClear) this.cache.clearCache(cacheKey);
    let cspSetting = this.cache.getCacheValue(cacheKey);
    if (!cspSetting) {
      cspSetting = await this.fetchSettings(language, siteName);
      if (cspSetting) this.cache.setCacheValue(cacheKey, cspSetting);
    }
    return cspSetting;
  }

  /**
   * Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
   * library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
   * want to use something else.
   * @returns {GraphQLClient} implementation
   */
  protected getGraphQLClient(): GraphQLRequestClient {
    if (!this.options.clientFactory) {
      throw new Error('clientFactory needs to be provided when initializing GraphQL client.');
    }
    return this.options.clientFactory({
      debugger: debugers.security,
      fetch: this.options.fetch,
      retries: (process.env.GRAPH_QL_SERVICE_RETRIES &&
        parseInt(process.env.GRAPH_QL_SERVICE_RETRIES, 10)) as number,
      retryStrategy: new DefaultRetryStrategy({
        statusCodes: [429, 502, 503, 504, 520, 521, 522, 523, 524],
        factor: 3,
      }),
    }) as GraphQLRequestClient;
  }

  /**
   * Gets cache client implementation
   * Override this method if custom cache needs to be used
   * @returns CacheClient instance
   */
  protected getCacheClient(): CacheClient<CSPSetting> {
    return new MemoryCacheClient<CSPSetting>({
      cacheEnabled: this.options.cacheEnabled ?? true,
      cacheTimeout: this.options.cacheTimeout ?? 10,
    });
  }
}
