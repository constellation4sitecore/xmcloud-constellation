import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

export interface WithDatasourceRenderingProps {
  rendering: ComponentRendering;
  fields?: unknown;
  dataFields?: unknown;
}

export function withDatasourceRendering<T extends WithDatasourceRenderingProps>(
  componentOrMap: React.ComponentType<T> | { [key: string]: React.ComponentType<T> }
): React.FC<T> {
  return (props) => {
    const { sitecoreContext } = useSitecoreContext();
    const siteName: string = sitecoreContext.site?.name ?? 'default';

    let InjectedComponent: React.ComponentType<T>;

    if (typeof componentOrMap === 'function') {
      InjectedComponent = componentOrMap;
    } else {
      InjectedComponent = componentOrMap[siteName] || componentOrMap['default'];
    }

    if (!props.rendering.dataSource) {
      return React.createElement(
        InjectedComponent,
        Object.assign({}, props, { fields: sitecoreContext.route?.fields })
      );
    }

    return React.createElement(InjectedComponent, props);
  };
}
