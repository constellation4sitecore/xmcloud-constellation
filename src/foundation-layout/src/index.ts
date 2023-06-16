import { ComponentParams, ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * Shared component props
 */
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams;
};
