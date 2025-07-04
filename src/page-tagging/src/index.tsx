import Head from 'next/head';
import React, { JSX } from 'react';
import { MetaProp } from './models';

export const PageMetadata = ({ metaProps }: { metaProps: MetaProp[] }): JSX.Element => {
  return (
    <Head>
      {metaProps.map((meta) => (
        <meta key={meta.name} name={meta.name} content={meta.content} />
      ))}
    </Head>
  );
};

export * from './models';
export * from './services';
