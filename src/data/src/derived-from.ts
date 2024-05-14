import { getItemTemplateInfo } from './get-template-info';

/**
 * Determines if an item is derived from a given template.
 * @param itemId The ID of the item to check.
 * @param templateId The ID of the template to check against.
 * @returns A boolean indicating whether the item is derived from the template.
 */
export async function derivedFrom(itemId: string, templateId: string): Promise<boolean> {
  const convertedTemplateId = templateId.replace(/[{}]/g, '').replaceAll('-', '').toUpperCase();
  const item = await getItemTemplateInfo(itemId);
  if (item?.template.id === convertedTemplateId) return true;
  const assetCondition = item?.template.baseTemplates.some((t) => t.id === convertedTemplateId);
  return assetCondition == undefined ? false : assetCondition;
}
