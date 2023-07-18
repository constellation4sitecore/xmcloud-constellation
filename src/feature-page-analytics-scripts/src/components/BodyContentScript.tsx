import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { Field } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { ComponentProps } from '../lib/component-props';

type BodyContentScriptProps = ComponentProps & {
  fields: {
    contentScript: Field<string>;
  };
};

const BodyContentScript = ({ fields }: BodyContentScriptProps) => {
  return (
    <script
      type="text/javascript"
      dangerouslySetInnerHTML={{ __html: fields.contentScript.value }}
    />
  );
};

export default withDatasourceRendering()<BodyContentScriptProps>(BodyContentScript);
