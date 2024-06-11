import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { castItem, mapToNew } from '@constellation4sitecore/mapper';
import { ComponentRendering, Item, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageMetadataType } from '../models/PageMetadata';
import { PageTaggingService } from '../services';

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
  const model = castItem<PageMetadataType>(layoutData.sitecore.route as Item);
  if (!model) return;
  let viewModel: PageMetadataType;
  if (model.inheritAuthorAndPublisher.value) {
    const fillAuthorAndPublisher = async (pageId: string, model: PageMetadataType) => {
      while (true) {
        const context = await new PageTaggingService(layoutData).getPageTagging(pageId);

        if (model.hasValidAuthorAndPublisher) {
          return;
        }

        if (context === null) {
          return;
        }

        if (
          !context?.template?.baseTemplates.some(
            (obj: any) => obj.id === '9ED6640464C9412290E1869CB3CEA566'
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
    viewModel = {
      browserTitle: model.browserTitle,
      keywords: model.keywords,
      metaDescription: model.metaDescription,
      metaPublisher: model.metaPublisher,
      metaAuthor: model.metaAuthor,
      inheritAuthorAndPublisher: model.inheritAuthorAndPublisher,
    };
    fillAuthorAndPublisher(layoutData.sitecore.route?.itemId as string, viewModel);
  } else {
    viewModel = {
      browserTitle: model.browserTitle,
      keywords: model.keywords,
      metaDescription: model.metaDescription,
      metaPublisher: model.metaPublisher,
      metaAuthor: model.metaAuthor,
      inheritAuthorAndPublisher: model.inheritAuthorAndPublisher,
    };
  }

  return {
    pageMetadata: viewModel,
  };
};

export default withDatasourceRendering()<PageMetadataProps>(PageMetadata);
