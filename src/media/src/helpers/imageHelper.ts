import { ImageFieldValue } from '@sitecore-jss/sitecore-jss-dev-tools';
import { ImageField } from '@sitecore-jss/sitecore-jss-nextjs';

export type ContentHubImageFieldValue = ImageFieldValue & {
  'stylelabs-content-id'?: string;
  'dam-id'?: string;
};

export type ContentHubImageField = ImageField & {
  value: ContentHubImageFieldValue;
};

/**
 * Check if image is a content hub image
 * @param imageField - Image field
 * @returns
 */
export const isContentHubImage = (imageField: ContentHubImageField): boolean => {
  if (imageField == null) return false;
  if (imageField.value['stylelabs-content-id'] || imageField.value['dam-id']) return true;
  return false;
};

/**
 * Add transformation to image url
 * @param imageUrl - Image url
 * @param transformation - Example '1x1w280', be sure wPX is at the end for media libary support
 * @returns
 */
export const addTransformation = (imageUrl: string, transformation: string): string => {
  if (!imageUrl || !transformation) return imageUrl;

  const queryStringJoinCharacter = imageUrl.includes('?') ? '&' : '?';

  if (imageUrl.includes('t=')) return imageUrl.replace(/t=[^&]*/, `t=${transformation}`);

  return `${imageUrl}${queryStringJoinCharacter}t=${transformation}`;
};

/**
 * Add transformation to image url
 * @param imageUrl - Image url
 * @param transformation - Example '1x1w280', be sure wPX is at the end for media libary support
 * @returns
 */
export const mediaTransformation = (
  imageUrl: string,
  transformation: string,
  imageField?: ImageField
): string => {
  if (!imageUrl || !transformation) return imageUrl;
  let idealHeigth = 0;
  const width = transformation.split('w')[1];
  const queryStringJoinCharacter = imageUrl.includes('?') ? '&' : '?';

  if (imageField) {
    const aspectRatioOriginal =
      (imageField?.value?.width as number) / (imageField?.value?.height as number);

    const aspectRatioOutput =
      parseInt(transformation.split('w')[0].split('x')[0]) /
      parseInt(transformation.split('w')[0].split('x')[1]);

    if (aspectRatioOriginal != aspectRatioOutput) {
      const expectedHeight = Math.round(parseInt(width) / aspectRatioOutput);
      const currentHeight = Math.round(parseInt(width) / aspectRatioOriginal);
      if (currentHeight < expectedHeight) {
        idealHeigth = expectedHeight;
        if (imageUrl.includes('h='))
          return imageUrl
            .replace(/h=[^&]*/, `h=${idealHeigth}`)
            .replace(/w=[^&]*/, ``)
            .replace('&&', '&');
        return `${imageUrl}${queryStringJoinCharacter}h=${idealHeigth}`
          .replace(/w=[^&]*/, ``)
          .replace('&&', '&');
      }
    }
  }

  if (imageUrl.includes('w=')) return imageUrl.replace(/w=[^&]*/, `w=${width}`);

  return `${imageUrl}${queryStringJoinCharacter}w=${width}`;
};
