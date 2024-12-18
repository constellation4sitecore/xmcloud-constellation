import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
export type AnalyticScripts = {
  headScripts: AnalyticScriptItem[];
  topBodyScripts: AnalyticScriptItem[];
  bottomBodyScripts: AnalyticScriptItem[];
};

export type AnalyticScriptItem = {
  id: string;
  template: {
    id: string;
  };
  fields: {
    name: string;
    jsonValue: string;
  }[];
};

export type ContentScript = {
  contentScript: Field<string>;
  noScript: Field<boolean>;
};

export type UrlScript = {
  urlScript: LinkField;
};
