import { Item } from '@sitecore-jss/sitecore-jss-nextjs';

export function castItem<T>(item: Item): T | null {
  return item.fields as T;
}
