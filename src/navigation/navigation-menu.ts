import { BaseItem } from '@/data/base-item';
import { LinkFields } from './link-fields';

export interface NavigationMenu {
  items: Array<LinkFields>;
}

export interface GraphNavigationMenu {
  items: BaseItem;
}
