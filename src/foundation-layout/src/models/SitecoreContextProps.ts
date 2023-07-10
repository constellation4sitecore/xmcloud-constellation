import { Redirect } from 'next';
import {
  DictionaryPhrases,
  ComponentPropsCollection,
  LayoutServiceData,
  SiteInfo,
} from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * Sitecore Context props
 */
export type SitecoreContextProps = {
  site: SiteInfo;
  locale: string;
  dictionary: DictionaryPhrases;
  componentProps: ComponentPropsCollection;
  notFound: boolean;
  layoutData: LayoutServiceData;
  redirect?: Redirect;
};
