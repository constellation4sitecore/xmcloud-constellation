import { ItemInfo } from './services/data-service';
/**
 * @deprecated Use DataService.getTemplateInfo(itemId: string) instead
 * @param itemId
 * @returns
 */
export declare function getItemTemplateInfo(itemId: string): Promise<ItemInfo | null>;
