import { mapToNew } from '@constellation4sitecore/mapper';
import React from 'react';
import { AnalyticScriptItem, ContentScript, UrlScript } from '../models';
import { TEMPLATES_ID } from '../constants/analyticsScripts';
import { isServer } from '@constellation4sitecore/constellation-sxa-nextjs';

export type AnalyticsScriptsProps = {
  scripts: AnalyticScriptItem[];
  strategy: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
};

const PageAnalyticsScripts = (props: AnalyticsScriptsProps): JSX.Element => {
  return (
    <>
      {props.scripts.map((script: AnalyticScriptItem) => {
        if (script.template.id === TEMPLATES_ID.contentScript) {
          const contentScriptModel = mapToNew<ContentScript>(script);
          const computedStrategy = contentScriptModel?.lazy?.value ? 'lazyOnload' : props.strategy;
          if (computedStrategy === 'lazyOnload' && isServer()) return null;
          return (
            <>
              {contentScriptModel && (
                <>
                  {!contentScriptModel.noScript.value && (
                    <script
                      key={script.id}
                      id={`_next-${script.id}-init`}
                      type="text/javascript"
                      data-nscript={computedStrategy}
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
          if (computedStrategy === 'lazyOnload' && isServer()) return null;
          return (
            <>
              {mappedScriptModel && (
                <script
                  key={script.id}
                  id={`_next-${script.id}-init`}
                  data-nscript={computedStrategy}
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
};

export default PageAnalyticsScripts;
