import { constants, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs';
import config from '../../../../../src/temp/config';
import { gql } from 'graphql-request';

export async function getItemTemplateInfo(itemId) {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

  const query = gql`
    query GetItemTemplateInfo($itemId: String!, $language: String!) {
      item: item(path: $itemId, language: $language) {
        id
        name
        template {
          id
          name
          baseTemplates {
            id
            name
          }
        }
      }
    }
  `;

  const result = await graphQLClient.request(query, {
    itemId: itemId,
    language: config.defaultLanguage,
  });

  return result.item;
}
