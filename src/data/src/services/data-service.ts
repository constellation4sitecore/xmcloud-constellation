import { GraphqlService } from '@constellation4sitecore/constellation-sxa-nextjs';
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

export class DataService extends GraphqlService {
  /**
   * Get Item Url
   * @param itemId
   * @returns Url object
   */
  async getItemUrl(itemId: string): Promise<Url> {
    const client = this.getClient();

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

    const result = await client.request<{ item: { url: Url } }>(query, {
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
    const client = this.getClient();

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

    const result = await client.request<{ item: ItemInfo }>(query, {
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
    const client = this.getClient();

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

    const result = (await client.request(query, {
      itemId: itemId,
      language: options?.language ? options.language : this.language,
      ownFields: options?.showStandardValues ? false : true,
    })) as ItemResult;

    return mapToNew<TItem>(result.item);
  }
  /**
   * Determines if an item is derived from a given template.
   * @param itemId The ID of the item to check.
   * @param templateId The ID of the template to check against.
   * @returns A boolean indicating whether the item is derived from the template.
   */
  async derivedFrom(itemId: string, templateId: string): Promise<boolean> {
    const convertedTemplateId = templateId.replace(/[{}]/g, '').replaceAll('-', '').toUpperCase();
    const item = await this.getTemplateInfo(itemId);
    if (item?.template.id === convertedTemplateId) return true;
    const assetCondition = item?.template.baseTemplates.some((t) => t.id === convertedTemplateId);
    return assetCondition == undefined ? false : assetCondition;
  }
}
