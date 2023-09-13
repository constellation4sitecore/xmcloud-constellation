import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

export interface WithDatasourceRenderingProps {
  rendering: ComponentRendering;
  fields?: unknown;
  dataFields?: unknown;
}

export function withDatasourceRendering(){
  return function withDatasourceRenderingHoc<ComponentProps extends WithDatasourceRenderingProps>(
    componentOrMap: React.ComponentType<ComponentProps> | { [key: string]: React.ComponentType<ComponentProps> }
  ){
    return function WithDatasourceRendering(props: ComponentProps)
    {
      const { sitecoreContext } = useSitecoreContext();
      const siteName: string = sitecoreContext.site?.name ?? 'default';
  
      let InjectedComponent: React.ComponentType<ComponentProps>;
  
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

      return <InjectedComponent {...props} />;
    }
  }
}

