import {
  GraphQLClient,
  config,
  createGraphQLClientFactory,
  debug as debuggers,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { gql } from 'graphql-request';

export class PageTaggingService {
  private language: string;
  constructor(layoutData?: LayoutServiceData) {
    this.language = layoutData?.sitecore.context.language
      ? layoutData?.sitecore.context.language
      : (config.defaultLanguage as string);
  }

  async getPageTagging(pageId: string) {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.data,
    }) as GraphQLClient;

    const query = gql`
      query GetPageTagging($datasourceId: String!, $language: String!) {
        items: item(path: $datasourceId, language: $language) {
          parent {
            id
            name
            template {
              baseTemplates {
                id
              }
            }
          }
          fields {
            name
            jsonValue
          }
        }
      }
    `;

    const result = (await graphQLClient.request(query, {
      datasourceId: pageId,
      language: this.language,
    })) as any;

    return result.items;
  }
}
