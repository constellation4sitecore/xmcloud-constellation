import { AnalyticScripts } from '../models';

export type ExtendedDocumentInitialProps = {
  __NEXT_DATA__: {
    props: {
      pageProps: {
        statusCode: number;
        componentProps: { [key: string]: unknown };
      };
    };
  };
};
export const extractAnalyticsProps = (props: ExtendedDocumentInitialProps) => {
  if (props.__NEXT_DATA__.props.pageProps.statusCode == 500) return null;
  const analyticsProps = props.__NEXT_DATA__.props.pageProps.componentProps[
    'analyticScripts'
  ] as AnalyticScripts;
  console.log(analyticsProps);
  return analyticsProps;
};