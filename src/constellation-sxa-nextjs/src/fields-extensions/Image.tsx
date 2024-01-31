import { Image as JSSImage, ImageProps, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import React, { useEffect, useState } from 'react';

type ExtendedImageProps = ImageProps & {
  isSVG: boolean;
};

export const Image = (props: ExtendedImageProps) => {
  const [svg, setSVG] = useState<string | null>(null);
  useEffect(() => {
    if (props.isSVG && (props.field?.value as ImageField).value?.src) {
      const url = (props.field?.value as ImageField).value?.src as string;
      fetch(url)
        .then((response) => response.text())
        .then((svg) => setSVG(svg));
    }
  }, [props.isSVG]);

  return <>{svg && props.isSVG ? svg : <JSSImage {...props} />}</>;
};
