import {
  Field,
  ImageField,
  LinkField,
  SitecoreContextValue,
} from '@sitecore-jss/sitecore-jss-nextjs';

type SitecoreContext = {
  sitecoreContext: SitecoreContextValue;
};

/**
 * Checks if a field has content.
 * @param ctx - The Sitecore context.
 * @param field - The field to check. Example: LinkField, ImageField, Field<string>
 * @returns True if the field has content, false otherwise.
 */
export const hasContent = (
  ctx: SitecoreContext,
  field: LinkField | ImageField | Field<string>
): boolean => {
  if (ctx.sitecoreContext.pageEditing) return true;
  if (field === null || field === undefined) return false;
  if (!field.value) return false;
  if (Object.keys(field.value).includes('href')) {
    field = field as LinkField;
    return field.value?.href != '';
  }
  if (Object.keys(field.value).includes('src')) {
    field = field as ImageField;
    return (field?.value?.src?.length || 0) > 0;
  }
  return Object.keys(field.value).length > 0;
};
