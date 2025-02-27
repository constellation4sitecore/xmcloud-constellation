import { mapToNew } from '@constellation4sitecore/mapper';
import React from 'react';
import { AnalyticScriptItem, ContentScript, UrlScript } from '../models';
import { TEMPLATES_ID } from '../constants/analyticsScripts';
import Script from 'next/script';

export type AnalyticsScriptsProps = {
  scripts: AnalyticScriptItem[];
  strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
};

const PageAnalyticsNextScripts = (props: AnalyticsScriptsProps): JSX.Element => (
  <>
    {props.scripts.map((script: AnalyticScriptItem) => {
      if (script.template.id === TEMPLATES_ID.contentScript) {
        const contentScriptModel = mapToNew<ContentScript>(script);
        const computedStrategy = contentScriptModel?.lazy?.value ? 'lazyOnload' : props.strategy;
        return (
          <>
            {contentScriptModel && (
              <>
                {!contentScriptModel.noScript.value && (
                  <Script
                    key={script.id}
                    id={`_next-script-${script.id}-init`}
                    strategy={computedStrategy}
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
        const computedStrategy = mappedScriptModel?.lazy?.value ? 'lazyOnload' : props.strategy;
        return (
          <>
            {mappedScriptModel && (
              <Script
                key={script.id}
                id={`_next-script-${script.id}-init`}
                strategy={computedStrategy}
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

export default PageAnalyticsNextScripts;
