import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';

type HeadUrlScriptProps = ComponentProps & {
  fields: {
    urlScript: LinkField;
  };
};

const HeadUrlScript = ({ fields }: HeadUrlScriptProps) => {
  return (
    <Head>
      <script key={fields.urlScript?.value.href} src={fields.urlScript?.value.href} async />
    </Head>
  );
};

export default withDatasourceRendering()<HeadUrlScriptProps>(HeadUrlScript);
