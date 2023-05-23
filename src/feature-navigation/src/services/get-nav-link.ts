import { constants, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs';
// @ts-ignore
import config from '../../../../../../src/temp/config';
import { gql } from 'graphql-request';

export async function getNavLinks(navigationId: string): Promise<any | null> {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

  const query = gql`
    query GetNavLinks($datasourceId: String!, $language: String!) {
      items: item(path: $datasourceId, language: $language) {
        id
        name
        children {
          results {
            ...navigationLink
          }
        }
      }
    }
    fragment templateInfo on ItemTemplate {
      id
      name
    }
    fragment navigationLink on C__NavigationLink {
      id
      name
      displayName
      template {
        ...templateInfo
      }
      fields {
        name
        jsonValue
      }
    }
  `;

  const result = (await graphQLClient.request(query, {
    datasourceId: navigationId,
    language: config.defaultLanguage,
  })) as any;

  return result.items.children;
}
