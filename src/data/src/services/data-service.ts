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
   * Get Item
   * @param itemId
   * @param language? If not provided, the language will be resolved based on layout context.
   * @returns
   */
  async getItem<TItem>(
    itemId: string,
    language?: string,
    showStandardValues?: boolean
  ): Promise<TItem | null> {
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
      language: language ? language : this.language,
      ownFields: showStandardValues ? false : true,
    })) as ItemResult;

    return mapToNew<TItem>(result.item);
  }
}
