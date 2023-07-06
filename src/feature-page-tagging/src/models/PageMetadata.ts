import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
export type PageMetadataType = {
  browserTitle: Field<string>;
  keywords: Field<string>;
  metaDescription: Field<string>;
  metaAuthor: Field<string>;
  metaPublisher: Field<string>;
  inheritAuthorAndPublisher: {
    value: boolean;
  };
  hasValidAuthorAndPublisher: boolean;
  hasValidAuthor: boolean;
  hasValidPublisher: boolean;
};
