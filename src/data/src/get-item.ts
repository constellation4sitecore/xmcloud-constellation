import { gql } from 'graphql-request';
import { mapToNew } from '@constellation4sitecore/mapper';
import {
  createGraphQLClientFactory,
  GraphQLClient,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { debug as debuggers } from '@constellation4sitecore/constellation-sxa-nextjs';
import { JssConfig } from '@constellation4sitecore/constellation-sxa-nextjs';
import { config } from '@constellation4sitecore/constellation-sxa-nextjs';

type ItemResult = {
  item: unknown;
};

/**
 * @deprecated Use DataService.getItem(itemId: string) instead
 * @param itemId
 * @param language
 * @returns
 */
export async function getItem<T>(itemId: string, language?: string): Promise<T | null> {
  const projectConfig = config as JssConfig;
  const graphqlFactory = createGraphQLClientFactory();
  const graphQLClient = graphqlFactory({
    debugger: debuggers.data,
  }) as GraphQLClient;

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
    language: language ? language : projectConfig.defaultLanguage,
  })) as ItemResult;

  return mapToNew<T>(result.item);
}
