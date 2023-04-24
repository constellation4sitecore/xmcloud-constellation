import { BaseItem } from '@constellation4sitecore/foundation-data';
import { LinkFields } from './link-fields';

export interface NavigationMenu {
  items: Array<LinkFields>;
}

export interface GraphNavigationMenu {
  items: BaseItem;
}
