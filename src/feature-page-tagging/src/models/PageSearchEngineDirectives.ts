import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
export type PageSearchEngineDirectivesType = {
  searchEngineIndexesPage: Field<boolean>;
  searchEngineFollowsLinks: Field<boolean>;
  searchEngineIndexesImages: Field<boolean>;
  searchEngineCanCachePage: Field<boolean>;
  searchEngineCanSnippetPage: Field<boolean>;
  allowODPSnippet: Field<boolean>;
};
