import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { PageMetadataType } from '../models/PageMetadata';
import { getPageTagging } from '../services';

export const metadataRepository = async (pageId: string) => {
  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageMetadataType>(pageTagging);

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

  return model;
};

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
