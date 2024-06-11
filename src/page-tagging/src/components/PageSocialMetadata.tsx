import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { castItem, mapToNew } from '@constellation4sitecore/mapper';
import { ComponentRendering, Item, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageSocialMetadataType } from '../models/PageSocialMetadata';
import { PageTaggingService } from '../services';

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

const fillSocialMetadata = async (
  pageId: string,
  model: PageSocialMetadataType,
  layoutData: LayoutServiceData
) => {
  const pathItem = layoutData.sitecore.context.itemPath as string;

  const path = pathItem.split('?')[0].split('/')[1];

  model.siteUrl = `${process.env.PUBLIC_URL}/${path}`;

  while (true) {
    const context = await new PageTaggingService(layoutData).getPageTagging(pageId);

    if (!model.twitterInheritValues) {
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
        (obj: any) => obj.id === '9ED6640464C9412290E1869CB3CEA566'
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
  const model = castItem<PageSocialMetadataType>(layoutData.sitecore.route as Item);
  if (!model) return;
  const pathItem = layoutData.sitecore.context.itemPath as string;
  const path = pathItem.split('?')[0].split('/')[1];
  model.siteUrl = `${process.env.PUBLIC_URL}/${path}`;
  let viewModel: PageSocialMetadataType;
  viewModel = {
    twitterCardType: model.twitterCardType,
    twitterCreator: model.twitterCreator,
    twitterSite: model.twitterSite,
    siteUrl: model.siteUrl,
    socialThumbnail: model.socialThumbnail,
    twitterInheritValues: model.twitterInheritValues,
    browserTitle: model.browserTitle,
    metaDescription: model.metaDescription,
  };
  if (model.twitterInheritValues.value) {
    await fillSocialMetadata(model.siteUrl, viewModel, layoutData);
  }

  return {
    pageSocialMetadata: viewModel,
  };
};

export default withDatasourceRendering()<PageSocialMetadataProps>(PageSocialMetadata);
