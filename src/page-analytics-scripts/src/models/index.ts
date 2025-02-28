import { Field, LinkField } from '@sitecore-jss/sitecore-jss-nextjs';

export type AnalyticsScriptsProps = {
  scripts: AnalyticScriptItem[];
  strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
};
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
  lazy: Field<boolean>;
};

export type UrlScript = {
  urlScript: LinkField;
  async: Field<boolean>;
  defer: Field<boolean>;
  lazy: Field<boolean>;
};
