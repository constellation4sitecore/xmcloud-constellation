import {
  config,
  createGraphQLClientFactory,
  GraphQLClient,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { debug as debuggers } from '@constellation4sitecore/constellation-sxa-nextjs';
import { gql } from 'graphql-request';
import { mapToNew } from '@constellation4sitecore/mapper';

type ItemResult = {
  item: unknown;
};

export type GetItemOptions = {
  language?: string;
  showStandardValues?: boolean;
};

export type Url = {
  url: string;
  path: string;
};

export type TemplateInfo = {
  id: string;
  name: string;
};
export type ItemInfo = {
  id: string;
  name: string;
  template: {
    id: string;
    name: string;
    baseTemplates: TemplateInfo[];
  };
};

export class DataService {
  private language: string;

  /**
   * Initialize the label service
   * @param layoutData : Layout service data
   */
  constructor(layoutData?: LayoutServiceData) {
    this.language = layoutData?.sitecore.context.language
      ? layoutData?.sitecore.context.language
      : (config.defaultLanguage as string);
  }

  /**
   * Get Item Url
   * @param itemId
   * @returns Url object
   */
  async getItemUrl(itemId: string): Promise<Url> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.data,
    }) as GraphQLClient;

    const query = gql`
      query GetItemUrl($itemId: String!, $language: String!) {
        item: item(path: $itemId, language: $language) {
          id
          name
          path
          url {
            path
            url
          }
        }
      }
    `;

    const result = await graphQLClient.request<{ item: { url: Url } }>(query, {
      language: this.language,
      itemId: itemId,
    });

    return result.item.url;
  }

  /**
   * Get Template Info
   * @param itemId
   * @returns ItemInfo
   */
  async getTemplateInfo(itemId: string): Promise<ItemInfo | null> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.data,
    }) as GraphQLClient;

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

    const result = await graphQLClient.request<{ item: ItemInfo }>(query, {
      itemId: itemId,
      language: this.language,
    });

    return result.item;
  }

  /**
   * Get Item
   * @param itemId
   * @param language? If not provided, the language will be resolved based on layout context.
   * @returns
   */
  async getItem<TItem>(itemId: string, options?: GetItemOptions): Promise<TItem | null> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.data,
    }) as GraphQLClient;

    const query = gql`
      query GetItem($itemId: String!, $language: String!, $ownFields: Boolean!) {
        item: item(path: $itemId, language: $language) {
          id
          name
          fields(ownFields: $ownFields) {
            name
            jsonValue
          }
        }
      }
    `;

    const result = (await graphQLClient.request(query, {
      itemId: itemId,
      language: options?.language ? options.language : this.language,
      ownFields: options?.showStandardValues ? false : true,
    })) as ItemResult;

    return mapToNew<TItem>(result.item);
  }
}
