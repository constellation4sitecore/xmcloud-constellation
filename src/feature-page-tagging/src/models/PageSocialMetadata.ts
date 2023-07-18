import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import { PageMetadataType } from './PageMetadata';

export type PageSocialMetadataType = PageMetadataType & {
  socialThumbnail: ImageField;
  twitterCardType: Field<string>;
  twitterSite: Field<string>;
  twitterCreator: Field<string>;
  inheritTwitterValues: { value: boolean };
  siteUrl: string;
};
