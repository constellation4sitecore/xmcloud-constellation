import { mapToNew } from '@constellation4sitecore/mapper';
import React from 'react';
import { AnalyticScriptItem, AnalyticsScriptsProps, ContentScript, UrlScript } from '../models';
import { TEMPLATES_ID } from '../constants/analyticsScripts';

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
                    id={`_next-${script.id}-init`}
                    type="text/javascript"
                    data-nscript={props.strategy}
                    dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
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
                id={`_next-${script.id}-init`}
                data-nscript={props.strategy}
                src={mappedScriptModel.urlScript.value.href}
                async={mappedScriptModel?.async?.value ? true : undefined}
                defer={mappedScriptModel?.defer?.value ? true : undefined}
              />
            )}
          </>
        );
      }
    })}
  </>
);

export default PageAnalyticsScripts;
