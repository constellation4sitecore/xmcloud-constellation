import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { PageSocialMetadataType } from '../models/PageSocialMetadata';
import { getPageTagging } from '../services';
import { getSiteName } from './getSiteName';
// eslint-disable-next-line @next/next/no-document-import-in-page
import { DocumentContext } from 'next/document';

export const socialMetadataRepository = async (pageId: string, ctx: DocumentContext) => {
  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageSocialMetadataType>(pageTagging);
  if (model) {
    await fillAuthorAndPublisher(pageId, model, ctx);
  }

  return model;
};

const fillAuthorAndPublisher = async (
  pageId: string,
  model: PageSocialMetadataType,
  ctx: DocumentContext
) => {
  const siteName = getSiteName(ctx)?.toLocaleLowerCase();

  if (ctx.query.path?.length === 1) {
    model.siteUrl = `https://${siteName}.com/`;
  } else if (ctx.query.path) {
    if (ctx.query.path?.length > 1) {
      model.siteUrl = `https://${siteName}.com`;
      for (let i = 1; i < ctx.query.path.length; i++) {
        model.siteUrl += `/${ctx.query.path[i]}`;
      }
    }
  }

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
