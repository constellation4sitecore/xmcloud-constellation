import { ComponentParams } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { ComponentType } from 'react';
// @ts-ignore
import { componentFactory } from '../../../../../../src/temp/componentFactory';
//import { getDatasource } from './getDatasource';

export type RenderingProps = {
  datasourceID?: string;
  componentName: string;
  views?: ViewComponent[];
  params?: ComponentParams;
};

type ViewComponent = {
  Component: React.ComponentType<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: any;
};

Rendering.getInitialPropsFromLibrary = async (
  Comp: ComponentType<unknown>,
  getStaticProps: any,
  datasourceID?: string | null,
  params?: ComponentParams | null
) => {
  let views: ViewComponent[] = [];

  if (!datasourceID) {
    const compGetStaticProps = getStaticProps;
    const p = await compGetStaticProps(params);
    views = [
      {
        Component: Comp,
        props: p,
      },
    ];
  } else {
    /* const Comp = componentFactory(componentName);
     var p = await getStaticProps(datasourceID)
    views = [{
        Compoent: Comp,
        props: p,
    }];*/
  }
  return { views: views, componentName: Comp.name, datasourceID: datasourceID, params: params };
};

Rendering.getInitialProps = async (
  componentName: string,
  datasourceID?: string | null,
  params?: ComponentParams | null
) => {
  let views: ViewComponent[] = [];

  if (!datasourceID) {
    const Comp = componentFactory(componentName);
    const compGetStaticProps = componentFactory(componentName, 'getStaticProps');
    const p = await compGetStaticProps(params);
    views = [
      {
        Component: Comp,
        props: p,
      },
    ];
  } else {
    /* const Comp = componentFactory(componentName);
     var p = await getStaticProps(datasourceID)
    views = [{
        Compoent: Comp,
        props: p,
    }];*/
  }
  return { views: views, componentName: componentName, datasourceID: datasourceID, params: params };
};

export default function Rendering(props: RenderingProps) {
  return (
    <>
      {props.views?.map((view) => {
        const Comp = view.Component;
        return <Comp {...view.props} key="first" />;
      })}
    </>
  );
}
