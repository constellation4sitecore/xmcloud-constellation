import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export interface NavigationLink {
  link: LinkField;
  useThisDisplayName: Field<boolean>;
}
