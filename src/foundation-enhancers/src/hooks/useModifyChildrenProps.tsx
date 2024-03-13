import { filterPlaceholders } from '@constellation4sitecore/foundation-enhancers';
import { ComponentPropsReactContext, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';
import { useContext } from 'react';
/**
 * Use this hook to modify the props of the children components (Placeholder).
 * @param rendering The rendering object of the current component.
 * @param newProps  The new props to be added to the children components.
 * @returns The modified props of the children components.
 **/
export const useModifyChildrenProps = (
  rendering: ComponentRendering,
  newProps: { [key: string]: unknown }
) => {
  const componentPropsCollection = useContext(ComponentPropsReactContext);
  const placeholders = filterPlaceholders(
    Object.values(rendering.placeholders || {}).flat() as ComponentRendering[]
  );
  const modifiedProps: { [key: string]: unknown } = {};
  placeholders.forEach((item: ComponentRendering) => {
    const key = item.uid;
    const propsContext = componentPropsCollection[key as string] || {};
    Object.assign(propsContext, newProps);
    componentPropsCollection[key as string] = propsContext;
    modifiedProps[key as string] = propsContext;
  });
  return modifiedProps;
};
