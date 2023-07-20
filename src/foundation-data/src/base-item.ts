import { Item } from '@sitecore-jss/sitecore-jss-nextjs';

export interface BaseItem extends Item {
  template: Template;
  __typename: string;
  hasChildren: boolean;
  children: {
    results: BaseItem[];
  };
}

type Template = {
  id: string;
  name: string;
};
