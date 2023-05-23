import { ComponentRendering } from '@sitecore-jss/sitecore-jss-nextjs';

export type RenderingIndex = {
  rendering: ComponentRendering;
  index: number;
};

export declare function getRenderingIndex(
  theObject: unknown,
  uid: string,
  componentName: string,
  index?: number | null
): RenderingIndex | null;
