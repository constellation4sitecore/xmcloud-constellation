import { BaseItem } from '@constellation4sitecore/foundation-data';
import { ComponentProps } from '@constellation4sitecore/foundation-layout';
import { TEMPLATES_ID } from '../constants/analyticsScripts';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { ContentScript } from '../models/content-script';
import { UrlScript } from '../models/url-script';
import { getAnalyticsScripts } from '../services/get-analytics-scripts';
import { ComponentParams } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

type HeaderScriptsProps = ComponentProps & {
  headerScripts: BaseItem[];
};

const PageAnalyticsScripts = (props: HeaderScriptsProps): JSX.Element => (
  <>
    {props.headerScripts.map((script: BaseItem) => {
      if (script.template.id === TEMPLATES_ID.contentScript) {
        const contentScriptModel = mapToNew<ContentScript>(script);
        return (
          <>
            {contentScriptModel && (
              <script
                key={script.id}
                type="text/javascript"
                dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
              />
            )}
          </>
        );
      } else {
        const mappedScriptModel = mapToNew<UrlScript>(script);
        return (
          <>
            {mappedScriptModel && (
              <script key={script.id} src={mappedScriptModel.urlScript.value.href} async />
            )}
          </>
        );
      }
    })}
  </>
);

export const getStaticProps = async (params: ComponentParams) => {
  const headScripts = await getAnalyticsScripts(params['datasourceID']);
  return { headerScripts: headScripts };
};

export default PageAnalyticsScripts;
