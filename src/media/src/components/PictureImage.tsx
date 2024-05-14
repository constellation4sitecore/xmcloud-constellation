import { Image, ImageField, ImageFieldValue, ImageProps } from '@sitecore-jss/sitecore-jss-nextjs';
import {
  ContentHubImageField,
  addTransformation,
  isContentHubImage,
  mediaTransformation,
} from '../helpers/imageHelper';
import React from 'react';

export type TransformationOptions = {
  mobile: string;
  tablet?: string;
  desktop?: string;
  largeDesktop?: string;
};

export type PictureImageProps = ImageProps & {
  transformations: TransformationOptions;
  className?: string;
  alt?: string;
  isContentHubImage?: boolean;
  loading?: 'lazy';
  editable?: boolean;
  width?: number;
  height?: number;
};

const PictureStaticImage = (props: PictureImageProps): JSX.Element => {
  const width = props.width ?? '100%';
  const height = props.height ?? 'auto';

  return (
    <picture className={props.className}>
      {props.transformations.largeDesktop && (
        <source
          media="(min-width: 1920px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(props.src as string, props.transformations.largeDesktop)
              : mediaTransformation(props.src as string, props.transformations.largeDesktop)
          }
        />
      )}
      {props.transformations.desktop && (
        <source
          media="(min-width: 1400px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(props.src as string, props.transformations.desktop)
              : mediaTransformation(props.src as string, props.transformations.desktop)
          }
        />
      )}
      {props.transformations.tablet && (
        <source
          media="(min-width: 768px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(props.src as string, props.transformations.tablet)
              : mediaTransformation(props.src as string, props.transformations.tablet)
          }
        />
      )}
      {props.transformations.mobile && (
        <img
          src={
            props.isContentHubImage
              ? addTransformation(props.src as string, props.transformations.mobile)
              : mediaTransformation(props.src as string, props.transformations.mobile)
          }
          loading={props.loading}
          alt={props.alt}
          width={width as number}
          height={height as number}
        />
      )}
    </picture>
  );
};
const PictureManagedImage = (props: PictureImageProps) => {
  if (!props.field) return null;
  const field = props.field as ImageField;
  const mobileField = { ...field };
  const valueField = mobileField.value as ImageFieldValue;
  const width = props.width || field?.value?.width || '100%';
  const height = props.height || field?.value?.height || 'auto';

  valueField.src = props.isContentHubImage
    ? addTransformation(field.value?.src as string, props.transformations.mobile)
    : mediaTransformation(field.value?.src as string, props.transformations.mobile, field);
  mobileField.value = valueField;

  if (props.isContentHubImage) {
    if (mobileField.value['dam-alt']) {
      mobileField.value.alt = mobileField.value['dam-alt'];
    }
  }

  return (
    <picture className={props.className}>
      {props.transformations.largeDesktop && (
        <source
          media="(min-width: 1920px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(field.value?.src as string, props.transformations.largeDesktop)
              : mediaTransformation(
                  field.value?.src as string,
                  props.transformations.largeDesktop,
                  field
                )
          }
        />
      )}
      {props.transformations.desktop && (
        <source
          media="(min-width: 1400px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(field.value?.src as string, props.transformations.desktop)
              : mediaTransformation(
                  field.value?.src as string,
                  props.transformations.desktop,
                  field
                )
          }
        />
      )}
      {props.transformations.tablet && (
        <source
          media="(min-width: 768px)"
          srcSet={
            props.isContentHubImage
              ? addTransformation(field.value?.src as string, props.transformations.tablet)
              : mediaTransformation(field.value?.src as string, props.transformations.tablet, field)
          }
        />
      )}
      {props.transformations.mobile && (
        <Image
          width={width}
          height={height}
          field={mobileField}
          loading={props.loading}
          editable={props.editable}
        />
      )}
    </picture>
  );
};

export const PictureImage = (props: PictureImageProps) => {
  let isContentHubImageProp = props.isContentHubImage;
  if (!props.src) {
    // infer if is contenthub
    isContentHubImageProp = isContentHubImage(props.field as ContentHubImageField);
  }
  return (
    <>
      {props.src ? (
        <PictureStaticImage {...props} isContentHubImage={isContentHubImageProp} />
      ) : (
        <PictureManagedImage {...props} isContentHubImage={isContentHubImageProp} />
      )}
    </>
  );
};
