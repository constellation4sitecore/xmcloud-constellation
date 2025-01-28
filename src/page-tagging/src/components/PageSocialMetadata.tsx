import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageSocialMetadataType } from '../models/PageSocialMetadata';

type PageSocialMetadataProps = ComponentProps & {
  pageSocialMetadata: PageSocialMetadataType;
};

const PageSocialMetadata = (_: PageSocialMetadataProps) => {
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

export default withDatasourceRendering()<PageSocialMetadataProps>(PageSocialMetadata);
