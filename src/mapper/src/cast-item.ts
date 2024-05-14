import { ComponentRendering, Item } from '@sitecore-jss/sitecore-jss-nextjs';

export function castItem<T>(item: Item | ComponentRendering): T | null {
  return item.fields as T;
}
