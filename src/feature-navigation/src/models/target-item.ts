import { Field } from '@sitecore-jss/sitecore-jss-nextjs';

export type TargetItem = {
  id: string;
  url: string;
  name: string;
  displayName: string;
  fields: {
    navigationTitle: Field<string>;
    teaser: Field<string>;
  };
  bestLinkText: string;
};
