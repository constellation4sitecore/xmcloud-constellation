import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
export type PageMetadataType = {
  browserTitle: Field<string>;
  keywords: Field<string>;
  metaDescription: Field<string>;
  metaAuthor: Field<string>;
  metaPublisher: Field<string>;
  inheritAuthorAndPublisher: Field<boolean>;
  hasValidAuthorAndPublisher: Field<boolean>;
  hasValidAuthor: Field<boolean>;
  hasValidPublisher: Field<boolean>;
};
