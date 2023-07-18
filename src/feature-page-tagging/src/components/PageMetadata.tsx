import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { ComponentRendering, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageMetadataType } from '../models/PageMetadata';
import { getPageTagging } from '../services';

type PageMetadataProps = ComponentProps & {
  pageMetadata: PageMetadataType;
};

const PageMetadata = ({ pageMetadata }: PageMetadataProps): JSX.Element => {
  return (
    <>
      <Head>
        {pageMetadata && pageMetadata.keywords.value !== '' && (
          <meta name="keywords" content={pageMetadata.keywords.value} />
        )}
        {pageMetadata && pageMetadata.metaDescription.value !== '' && (
          <meta name="description" content={pageMetadata.metaDescription.value} />
        )}
        {pageMetadata && pageMetadata.metaPublisher.value !== '' && (
          <meta name="publisher" content={pageMetadata.metaPublisher.value} />
        )}
        {pageMetadata && pageMetadata.metaAuthor.value !== '' && (
          <meta name="author" content={pageMetadata.metaAuthor.value} />
        )}
      </Head>
    </>
  );
};

export const getStaticProps = async (_: ComponentRendering, layoutData: LayoutServiceData) => {
  const pageId = layoutData.sitecore.route?.itemId as string;

  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageMetadataType>(pageTagging);

  const fillAuthorAndPublisher = async (pageId: string, model: PageMetadataType) => {
    while (true) {
      const context = await getPageTagging(pageId);

      if (model.hasValidAuthorAndPublisher) {
        return;
      }

      if (context === null) {
        return;
      }

      if (
        !context?.template?.baseTemplates.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (obj: any) => obj.id === '82C03F8B84A448FDB5D4E412555A37E3'
        )
      ) {
        return;
      }

      const candidate = mapToNew<PageMetadataType>(context);

      if (candidate) {
        candidate.hasValidAuthorAndPublisher =
          !candidate?.inheritAuthorAndPublisher.value ||
          ((candidate.metaAuthor.value === '' || candidate.metaAuthor == null) &&
            (candidate.metaPublisher.value === '' || candidate.metaPublisher == null));

        candidate.hasValidAuthor =
          !candidate.inheritAuthorAndPublisher.value ||
          candidate.metaAuthor.value === '' ||
          candidate.metaAuthor == null;

        candidate.hasValidPublisher =
          !candidate.inheritAuthorAndPublisher ||
          candidate.metaPublisher.value === '' ||
          candidate.metaPublisher == null;
      }

      if (candidate?.hasValidAuthorAndPublisher) {
        if (!model.hasValidAuthor) {
          model.metaAuthor.value = candidate.metaAuthor.value;
        }
        if (!model.hasValidPublisher) {
          model.metaPublisher.value = candidate.metaPublisher.value;
        }

        return;
      }

      if (candidate?.hasValidPublisher && !model.hasValidPublisher) {
        model.metaPublisher.value = candidate.metaPublisher.value;
      }

      if (candidate?.hasValidAuthor && !model.hasValidAuthor) {
        model.metaAuthor.value = candidate.metaAuthor.value;
      }

      pageId = context.parent.id;
    }
  };

  if (model) {
    model.hasValidAuthorAndPublisher =
      !model?.inheritAuthorAndPublisher.value ||
      ((model.metaAuthor.value === '' || model.metaAuthor == null) &&
        (model.metaPublisher.value === '' || model.metaPublisher == null));

    model.hasValidAuthor =
      !model.inheritAuthorAndPublisher.value ||
      model.metaAuthor.value === '' ||
      model.metaAuthor == null;

    model.hasValidPublisher =
      !model.inheritAuthorAndPublisher ||
      model.metaPublisher.value === '' ||
      model.metaPublisher == null;
  }

  if (model) {
    await fillAuthorAndPublisher(pageId, model);
  }
  return {
    pageMetadata: model,
  };
};

export default withDatasourceRendering()<PageMetadataProps>(PageMetadata);
