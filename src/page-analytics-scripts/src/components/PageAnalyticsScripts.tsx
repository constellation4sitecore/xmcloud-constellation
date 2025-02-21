import { mapToNew } from '@constellation4sitecore/mapper';
import React from 'react';
import { AnalyticScriptItem, ContentScript, UrlScript } from '../models';
import { TEMPLATES_ID } from '../constants/analyticsScripts';

export type AnalyticsScriptsProps = {
  scripts: AnalyticScriptItem[];
};

const PageAnalyticsScripts = (props: AnalyticsScriptsProps): JSX.Element => (
  <>
    {props.scripts.map((script: AnalyticScriptItem) => {
      if (script.template.id === TEMPLATES_ID.contentScript) {
        const contentScriptModel = mapToNew<ContentScript>(script);
        return (
          <>
            {contentScriptModel && (
              <>
                {!contentScriptModel.noScript.value && (
                  <script
                    key={script.id}
                    type="text/javascript"
                    dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
                    async={contentScriptModel?.async?.value ? true : false}
                  />
                )}
                {contentScriptModel.noScript.value && (
                  <noscript
                    key={script.id}
                    dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
                  />
                )}
              </>
            )}
          </>
        );
      } else {
        const mappedScriptModel = mapToNew<UrlScript>(script);
        return (
          <>
            {mappedScriptModel && (
              <script
                key={script.id}
                src={mappedScriptModel.urlScript.value.href}
                async={mappedScriptModel?.async?.value ? true : false}
              />
            )}
          </>
        );
      }
    })}
  </>
);

export default PageAnalyticsScripts;
