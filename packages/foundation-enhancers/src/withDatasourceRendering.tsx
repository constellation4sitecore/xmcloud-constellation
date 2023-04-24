import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

export interface WithDatasourceRenderingProps {
  rendering: ComponentRendering;
  fields?: unknown;
  dataFields?: unknown;
}

export function withDatasourceRendering(): <ComponentProps extends WithDatasourceRenderingProps>(
  Component: React.ComponentType<ComponentProps>
) => (props: ComponentProps) => JSX.Element {
  return (Component) => {
    // eslint-disable-next-line react/display-name
    return (props) => {
      if (!props.rendering.dataSource) {
        const { sitecoreContext } = useSitecoreContext();
        return React.createElement(
          Component,
          Object.assign({}, props, { fields: sitecoreContext.route?.fields })
        );
      }
      return React.createElement(Component, Object.assign({}, props, { fields: props.fields }));
    };
  };
}
