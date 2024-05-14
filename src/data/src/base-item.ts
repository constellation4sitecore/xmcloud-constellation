import { Item } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * Represents a base item in Sitecore.
 */
export interface BaseItem extends Item {
  template: Template;
  __typename: string;
  hasChildren: boolean;
  children: {
    results: BaseItem[];
  };
}

/**
 * Represents a Sitecore template.
 */
type Template = {
  id: string;
  name: string;
};
