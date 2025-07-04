import { constants, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs/graphql';
// @ts-ignore
import config from '../../../../../../src/temp/config';
import { gql } from 'graphql-request';
import { GraphqlService } from '@constellation4sitecore/constellation-sxa-nextjs';

export class NavigationService extends GraphqlService {
  constructor(layoutData: LayoutServiceData) {
    super(layoutData);
  }

  async getNavLinks(navigationId: string): Promise<any | null> {
    const graphQLClient = this.getClient();
    const query = gql`
      query GetNavLinks($datasourceId: String!, $language: String!) {
        items: item(path: $datasourceId, language: $language) {
          id
          name
          children {
            results {
              ...navigationLink
              ...linkGroup
              ...imageNavigationLink
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
        __typename
      }

      fragment linkGroup on C__LinkGroup {
        id
        name
        template {
          ...templateInfo
        }
        fields {
          name
          jsonValue
        }
        __typename
        hasChildren
      }

      fragment imageNavigationLink on ImageNavigationLink {
        id
        name
        template {
          ...templateInfo
        }
        fields {
          name
          jsonValue
        }
        __typename
        hasChildren
      }
    `;

    const result = (await graphQLClient.request(query, {
      datasourceId: navigationId,
      language: this.language,
    })) as any;

    return result.items.children;
  }
}
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
            ...linkGroup
            ...imageNavigationLink
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
      __typename
    }

    fragment linkGroup on C__LinkGroup {
      id
      name
      template {
        ...templateInfo
      }
      fields {
        name
        jsonValue
      }
      __typename
      hasChildren
    }

    fragment imageNavigationLink on ImageNavigationLink {
      id
      name
      template {
        ...templateInfo
      }
      fields {
        name
        jsonValue
      }
      __typename
      hasChildren
    }
  `;

  const result = (await graphQLClient.request(query, {
    datasourceId: navigationId,
    language: config.defaultLanguage,
  })) as any;

  return result.items.children;
}
