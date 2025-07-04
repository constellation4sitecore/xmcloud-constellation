import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  DefaultRetryStrategy,
  GraphQLRequestClient,
  GraphQLRequestClientFactory,
} from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { createGraphQLClientFactory } from './create';
import * as debuggers from '../debug';
import config from '../config';

export class GraphqlService {
  protected language: string;
  /**
   *
   */
  constructor(layoutData: LayoutServiceData) {
    this.language = layoutData.sitecore.context.language ?? config.defaultLanguage ?? 'en';
  }

  protected getClient = (): GraphQLRequestClient => {
    const graphqlFactory = createGraphQLClientFactory() as GraphQLRequestClientFactory;
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
