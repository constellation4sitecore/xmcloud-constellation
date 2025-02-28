import { mapToNew } from '@constellation4sitecore/mapper';
import React from 'react';
import { AnalyticScriptItem, AnalyticsScriptsProps, ContentScript, UrlScript } from '../models';
import { TEMPLATES_ID } from '../constants/analyticsScripts';
import Script from 'next/script';

const PageAnalyticsNextScripts = (props: AnalyticsScriptsProps): JSX.Element => (
  <>
    {props.scripts.map((script: AnalyticScriptItem, index: number) => {
      if (script.template.id === TEMPLATES_ID.contentScript) {
        const contentScriptModel = mapToNew<ContentScript>(script);
        const computedStrategy = contentScriptModel?.lazy?.value ? 'lazyOnload' : props.strategy;
        return (
          contentScriptModel && (
            <React.Fragment key={`${script.id}-${index}`}>
              {!contentScriptModel.noScript.value && (
                <Script
                  id={`_next-script-${script.id}-init`}
                  strategy={computedStrategy}
                  dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
                />
              )}
              {contentScriptModel.noScript.value && (
                <noscript
                  dangerouslySetInnerHTML={{ __html: contentScriptModel.contentScript.value }}
                />
              )}
            </React.Fragment>
          )
        );
      } else {
        const mappedScriptModel = mapToNew<UrlScript>(script);
        const computedStrategy = mappedScriptModel?.lazy?.value ? 'lazyOnload' : props.strategy;
        return (
          mappedScriptModel && (
            <Script
              key={`${script.id}-${index}`}
              id={`_next-script-${script.id}-init`}
              strategy={computedStrategy}
              src={mappedScriptModel.urlScript.value.href}
              async={mappedScriptModel?.async?.value ? true : undefined}
              defer={mappedScriptModel?.defer?.value ? true : undefined}
            />
          )
        );
      }
    })}
  </>
);

export default PageAnalyticsNextScripts;
