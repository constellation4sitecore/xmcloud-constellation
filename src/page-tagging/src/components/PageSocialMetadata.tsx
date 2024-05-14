import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { mapToNew } from '@constellation4sitecore/mapper';
import { ComponentRendering, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageSocialMetadataType } from '../models/PageSocialMetadata';
import { getPageTagging } from '../services';

type PageSocialMetadataProps = ComponentProps & {
  pageSocialMetadata: PageSocialMetadataType;
};

const PageSocialMetadata = ({ pageSocialMetadata }: PageSocialMetadataProps) => {
  return (
    <>
      <Head>
        {((pageSocialMetadata.twitterCreator && pageSocialMetadata.twitterCreator.value !== '') ||
          (pageSocialMetadata.twitterSite && pageSocialMetadata.twitterSite.value !== '')) && (
          <>
            <meta name="twitter:card" content={pageSocialMetadata.twitterCardType.value} />
            {pageSocialMetadata.twitterCreator &&
              pageSocialMetadata.twitterCreator.value !== '' && (
                <meta name="twitter:creator" content={pageSocialMetadata.twitterCreator.value} />
              )}
            {pageSocialMetadata.twitterSite && pageSocialMetadata.twitterSite.value !== '' && (
              <meta name="twitter:site" content={pageSocialMetadata.twitterSite.value} />
            )}
          </>
        )}
        {pageSocialMetadata.browserTitle && pageSocialMetadata.browserTitle.value !== '' && (
          <meta property="og:title" content={pageSocialMetadata.browserTitle.value} />
        )}
        {pageSocialMetadata.siteUrl && pageSocialMetadata.siteUrl !== '' && (
          <meta property="og:url" content={pageSocialMetadata.siteUrl} />
        )}
        {pageSocialMetadata.metaDescription && pageSocialMetadata.metaDescription.value !== '' && (
          <meta property="og:description" content={pageSocialMetadata.metaDescription.value} />
        )}
        {pageSocialMetadata.socialThumbnail.value &&
          pageSocialMetadata.socialThumbnail.value.src !== '' && (
            <meta property="og:image" content={pageSocialMetadata.socialThumbnail.value.src} />
          )}
      </Head>
    </>
  );
};

const fillAuthorAndPublisher = async (
  pageId: string,
  model: PageSocialMetadataType,
  layoutData: LayoutServiceData
) => {
  const pathItem = layoutData.sitecore.context.itemPath as string;

  const path = pathItem.split('?')[0].split('/')[1];

  model.siteUrl = `${process.env.PUBLIC_URL}/${path}`;

  while (true) {
    const context = await getPageTagging(pageId);

    if (!model.inheritTwitterValues) {
      return;
    }

    if (!(model.twitterCreator.value === '') || !(model.twitterSite.value === '')) {
      return;
    }

    if (context === null) {
      return;
    }

    if (
      !context.template.baseTemplates.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (obj: any) => obj.id === '6997EBA66972408F803C9EC8A62612A4'
      )
    ) {
      return;
    }

    const candidate = mapToNew<PageSocialMetadataType>(context);

    if (model.twitterCreator.value === '') {
      if (candidate) {
        model.twitterCreator.value = candidate.twitterCreator.value;
      }
    }

    if (model.twitterSite.value === '') {
      if (candidate) {
        model.twitterSite.value = candidate.twitterSite.value;
      }
    }

    pageId = context.parent.id;
  }
};

export const getStaticProps = async (_: ComponentRendering, layoutData: LayoutServiceData) => {
  const pageId = layoutData.sitecore.route?.itemId as string;

  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageSocialMetadataType>(pageTagging);
  if (model) {
    await fillAuthorAndPublisher(pageId, model, layoutData);
  }
  console.log(model?.socialThumbnail.value);
  return {
    pageSocialMetadata: model,
  };
};

export default withDatasourceRendering()<PageSocialMetadataProps>(PageSocialMetadata);
