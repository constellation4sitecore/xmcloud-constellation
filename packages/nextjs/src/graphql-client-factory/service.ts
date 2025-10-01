import { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import { createGraphQLClientFactory } from './create';
import * as debuggers from '../debug';
import { DefaultRetryStrategy, GraphQLRequestClient } from '@sitecore-content-sdk/nextjs/client';
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';
export class GraphqlService {
  protected language: string;
  /**
   *
   */
  constructor(layoutData: LayoutServiceData) {
    const config = defineConfig({});
    this.language = layoutData.sitecore.context.language ?? config.defaultLanguage ?? 'en';
  }

  protected getClient = (): GraphQLRequestClient => {
    const graphqlFactory = createGraphQLClientFactory();
    return graphqlFactory({
      debugger: debuggers.default.http,
      retries: (process.env.GRAPH_QL_SERVICE_RETRIES &&
        parseInt(process.env.GRAPH_QL_SERVICE_RETRIES, 10)) as number,
      retryStrategy: new DefaultRetryStrategy({
        statusCodes: [429, 502, 503, 504, 520, 521, 522, 523, 524],
        factor: 3,
      }),
    }) as GraphQLRequestClient;
  };
}
