import { constants, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs';
import { gql } from 'graphql-request';
// @ts-ignore
import config from '../../../../../../src/temp/config';

export async function getAnalyticsScripts(folderId: string) {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

  const query = gql`
    query GetAnalyticsScripts($datasourceId: String!, $language: String!) {
      item: item(path: $datasourceId, language: $language) {
        children {
          results {
            id
            template {
              id
            }
            fields {
              name
              jsonValue
            }
          }
        }
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    datasourceId: folderId,
    language: 'en',
  })) as any;

  return result.item.children.results;
}
