import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import React, { JSX } from 'react';
import { ComponentProps } from '../lib/component-props';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';

type PageMetadataProps = ComponentProps;

const PageMetadata = (_: PageMetadataProps): JSX.Element => {
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

export default withDatasourceRendering()<PageMetadataProps>(PageMetadata);
