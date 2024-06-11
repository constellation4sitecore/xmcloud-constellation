import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export type PageSocialMetadataType = {
  browserTitle: Field<string>;
  metaDescription: Field<string>;
  socialThumbnail: ImageField;
  twitterCardType: Field<string>;
  twitterSite: Field<string>;
  twitterCreator: Field<string>;
  inheritTwitterValues: Field<boolean>;
  siteUrl: string;
};
