import { getItemTemplateInfo } from './get-template-info';

export async function derivedFrom(itemId: string, templateId: string): Promise<boolean> {
  const convertedTemplateId = templateId.replace(/[{}]/g, '').replaceAll('-', '').toUpperCase();
  const item = await getItemTemplateInfo(itemId);
  if (item?.template.id === convertedTemplateId) return true;
  const assetCondition = item?.template.baseTemplates.some((t) => t.id === convertedTemplateId);
  return assetCondition == undefined ? false : assetCondition;
}
