import { constants, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs';
// @ts-ignore
import config from '../../../../../src/temp/config';
import { gql } from 'graphql-request';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';

type ItemResult = {
  item: unknown;
};

export async function getItem<T>(itemId: string): Promise<T | null> {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

  const query = gql`
    query GetItem($itemId: String!, $language: String!) {
      item: item(path: $itemId, language: $language) {
        id
        name
        fields {
          name
          jsonValue
        }
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    itemId: itemId,
    language: config.defaultLanguage,
  })) as ItemResult;

  return mapToNew<T>(result.item);
}
