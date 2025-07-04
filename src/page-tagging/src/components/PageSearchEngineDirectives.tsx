import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { JSX } from 'react';
import { ComponentProps } from '../lib/component-props';

export type PageSearchEngineDirectiveProps = ComponentProps;

export const PageSearchEngineDirectives = (_: PageSearchEngineDirectiveProps): JSX.Element => {
  const ctx = useSitecoreContext();
  return (
    <>
      {ctx.sitecoreContext.pageEditing && (
        <>
          This module has been deprecated please remove it from your component and use
          PageTaggingService to add meta-props
        </>
      )}
    </>
  );
};

export default withDatasourceRendering()<PageSearchEngineDirectiveProps>(
  PageSearchEngineDirectives
);
