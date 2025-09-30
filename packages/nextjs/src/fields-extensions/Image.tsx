import { Image as JSSImage, ImageProps, ImageField } from '@sitecore-content-sdk/nextjs';
import React, { useEffect, useState } from 'react';

export interface ExtendedImageProps extends ImageProps {
  isSvg?: boolean;
}

export const Image = (props: ExtendedImageProps) => {
  const [svg, setSVG] = useState<string | null>(null);
  useEffect(() => {
    if (props.isSvg && (props.field as ImageField).value?.src) {
      const url = (props.field as ImageField).value?.src as string;
      fetch(url)
        .then((response) => response.text())
        .then((svg) => setSVG(svg))
        .catch((error) => console.error('Error:', error));
    }
  }, [props.field, props.isSvg]);
  return (
    <>
      {svg && props.isSvg ? (
        <span dangerouslySetInnerHTML={{ __html: svg }}></span>
      ) : (
        <JSSImage {...props} />
      )}
    </>
  );
};
