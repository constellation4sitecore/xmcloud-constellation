import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { LinkField } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';
import { ComponentProps } from '../lib/component-props';

type BodyUrlScriptProps = ComponentProps & {
  fields: {
    urlScript: LinkField;
  };
};

const BodyUrlScript = ({ fields }: BodyUrlScriptProps) => {
  return <script key={fields.urlScript?.value.href} src={fields.urlScript?.value.href} async />;
};

export default withDatasourceRendering()<BodyUrlScriptProps>(BodyUrlScript);
