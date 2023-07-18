import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';

type HeadContentScriptProps = ComponentProps & {
  fields: {
    contentScript: Field<string>;
  };
};

const HeadContentScript = ({ fields }: HeadContentScriptProps) => {
  return (
    <Head>
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: fields.contentScript.value }}
      />
    </Head>
  );
};

export default withDatasourceRendering()<HeadContentScriptProps>(HeadContentScript);
