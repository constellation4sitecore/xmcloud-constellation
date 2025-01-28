import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { ComponentType, ReactElement } from 'react';

export interface WithDatasourceRenderingProps {
  rendering: ComponentRendering;
  fields?: unknown;
  dataFields?: unknown;
}

export function withDatasourceRendering() {
  return function withDatasourceRenderingHoc<ComponentProps extends WithDatasourceRenderingProps>(
    componentOrMap: ComponentType<ComponentProps> | { [key: string]: ComponentType<ComponentProps> }
  ) {
    return function WithDatasourceRendering(props: ComponentProps): ReactElement {
      const { sitecoreContext } = useSitecoreContext();
      const siteName: string = sitecoreContext.site?.name ?? 'default';

      let InjectedComponent: ComponentType<ComponentProps>;

      if (typeof componentOrMap === 'function') {
        InjectedComponent = componentOrMap;
      } else {
        InjectedComponent = componentOrMap[siteName] ?? componentOrMap['default'];
      }

      if (!props.rendering.dataSource) {
        return React.createElement(
          InjectedComponent,
          Object.assign({}, props, { fields: sitecoreContext.route?.fields })
        );
      }

      return React.createElement(InjectedComponent, props);
    };
  };
}
