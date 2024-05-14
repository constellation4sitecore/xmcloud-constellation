import { constants } from '@sitecore-jss/sitecore-jss-nextjs';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import { gql } from 'graphql-request';
// @ts-ignore
import config from '../../../../../../src/temp/config';

export async function getPageTagging(pageId: string) {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

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
    language: 'en',
  })) as any;

  return result.items;
}
