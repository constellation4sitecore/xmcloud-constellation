import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import { PageMetadataType } from './PageMetadata';

export type PageSocialMetadataType = PageMetadataType & {
  socialThumbnail: Field<string>;
  twitterCardType: Field<string>;
  twitterSite: Field<string>;
  twitterCreator: Field<string>;
  inheritTwitterValues: Field<boolean>;
  siteUrl: string;
};
