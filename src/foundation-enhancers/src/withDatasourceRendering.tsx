import { ComponentRendering, useSitecoreContext } from '@sitecore-jss/sitecore-jss-nextjs';
import React from 'react';

export interface WithDatasourceRenderingProps {
  rendering: ComponentRendering;
  fields?: unknown;
  dataFields?: unknown;
}

export function withDatasourceRendering(){
  return function withDatasourceRenderingHoc<ComponentsProps extends WithDatasourceRenderingProps>(
    componentOrMap: React.ComponentType<ComponentsProps> | { [key: string]: React.ComponentType<ComponentsProps> }
  ){
    return function WithDatasourceRendering(props: ComponentsProps)
    {
      const { sitecoreContext } = useSitecoreContext();
      const siteName: string = sitecoreContext.site?.name ?? 'default';
  
      let InjectedComponent: React.ComponentType<ComponentsProps>;
  
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
    }
  }
}

