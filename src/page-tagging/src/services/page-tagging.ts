import {
  GraphQLClient,
  config,
  createGraphQLClientFactory,
  debug as debuggers,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { Item, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import { gql } from 'graphql-request';
import { MetaProp } from '../models/MetaProps';
import { castItem, mapToNew } from '@constellation4sitecore/mapper';
import { PageMetadataType } from '../models/PageMetadata';
import { PageSearchEngineDirectivesType } from '../models/PageSearchEngineDirectives';
import { PageSocialMetadataType } from '../models/PageSocialMetadata';
import { CanonicalUrlService } from './canonical-url';
import { GetStaticPropsContext } from 'next';

type PageTagging = {
  parent: Item;
  template: {
    baseTemplates: {
      id: string;
    }[];
  };
  fields: {
    name: string;
    jsonValue: any;
  }[];
};

export class PageTaggingService {
  private language: string;
  private layoutData: LayoutServiceData;

  constructor(layoutData: LayoutServiceData) {
    this.language = layoutData?.sitecore.context.language
      ? layoutData?.sitecore.context.language
      : (config.defaultLanguage as string);
    this.layoutData = layoutData;
  }

  async getPageTagging(pageId: string): Promise<PageTagging | null> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.data,
    }) as GraphQLClient;

    const query = gql`
      query GetPageTagging($datasourceId: String!, $language: String!) {
        items: item(path: $datasourceId, language: $language) {
          parent {
            id
            name
            template {
              baseTemplates {
                id
              }
            }
          }
          template {
            baseTemplates {
              id
            }
          }
          fields {
            name
            jsonValue
          }
        }
      }
    `;

    const result = (await graphQLClient.request(query, {
      datasourceId: pageId,
      language: this.language,
    })) as any;

    return result.items;
  }

  async getMetaProps(): Promise<MetaProp[]> {
    var metaProps: MetaProp[] = [];
    const model = castItem<PageMetadataType>(this.layoutData.sitecore.route as Item);
    if (!model || !model.inheritAuthorAndPublisher) return metaProps;
    let viewModel: PageMetadataType;
    if (model.inheritAuthorAndPublisher.value) {
      const fillAuthorAndPublisher = async (pageId: string, model: PageMetadataType) => {
        while (true) {
          const context = await this.getPageTagging(pageId);

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

          pageId = context.parent.id ?? '';
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
      fillAuthorAndPublisher(this.layoutData.sitecore.route?.itemId as string, viewModel);
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
    if (viewModel.keywords.value !== '') {
      metaProps.push({ name: 'keywords', content: viewModel.keywords.value });
    }
    if (viewModel.metaDescription.value !== '') {
      metaProps.push({ name: 'description', content: viewModel.metaDescription.value });
    }
    if (viewModel.metaPublisher.value !== '') {
      metaProps.push({ name: 'publisher', content: viewModel.metaPublisher.value });
    }
    if (viewModel.metaAuthor.value !== '') {
      metaProps.push({ name: 'author', content: viewModel.metaAuthor.value });
    }
    return metaProps;
  }

  async getSearchEngineDirectiveProp(): Promise<MetaProp | null> {
    const model = castItem<PageSearchEngineDirectivesType>(this.layoutData.sitecore.route as Item);
    if (model) {
      if (!model.searchEngineIndexesPage) return null;
      const directives = getDirectives(model);

      const content = getContent(directives);
      return {
        name: 'robots',
        content: content,
      };
    }
    return null;
  }

  async getSocialMetadataProps(
    context: GetStaticPropsContext,
    options?: { languageEmbedding: boolean }
  ): Promise<MetaProp[]> {
    var metaProps: MetaProp[] = [];
    const service = new CanonicalUrlService(context);
    const model = castItem<PageSocialMetadataType>(
      this.layoutData.sitecore.route as Item
    ) as PageSocialMetadataType;
    if (!model || !model.twitterInheritValues) return metaProps;
    const viewModel: PageSocialMetadataType = {
      twitterCardType: model.twitterCardType,
      twitterCreator: model.twitterCreator,
      twitterSite: model.twitterSite,
      siteUrl: service.getUrl(options),
      socialThumbnail: model.socialThumbnail,
      twitterInheritValues: model.twitterInheritValues,
      browserTitle: model.browserTitle,
      metaDescription: model.metaDescription,
    };
    if (model?.twitterInheritValues?.value) {
      await this.fillSocialMetadata(this.layoutData?.sitecore?.route?.itemId ?? '', viewModel);
    }
    if (
      (viewModel.twitterCreator && viewModel.twitterCreator.value !== '') ||
      (viewModel.twitterSite && viewModel.twitterSite.value !== '')
    ) {
      if (viewModel.twitterCardType && viewModel.twitterCardType.value !== '') {
        metaProps.push({
          name: 'twitter:card',
          content: viewModel.twitterCardType.value,
        });
      }

      if (viewModel.twitterCreator && viewModel.twitterCreator.value !== '') {
        metaProps.push({
          name: 'twitter:creator',
          content: viewModel.twitterCreator.value,
        });
      }

      if (viewModel.twitterSite && viewModel.twitterSite.value !== '') {
        metaProps.push({
          name: 'twitter:site',
          content: viewModel.twitterSite.value,
        });
      }
    }

    if (viewModel.browserTitle && viewModel.browserTitle.value !== '') {
      metaProps.push({
        name: 'og:title',
        content: viewModel.browserTitle.value,
      });
    }

    if (viewModel.siteUrl && viewModel.siteUrl !== '') {
      metaProps.push({
        name: 'og:url',
        content: viewModel.siteUrl,
      });
    }

    if (viewModel.metaDescription && viewModel.metaDescription.value !== '') {
      metaProps.push({
        name: 'og:description',
        content: viewModel.metaDescription.value,
      });
    }

    if (viewModel.socialThumbnail.value && viewModel.socialThumbnail.value.src !== '') {
      metaProps.push({
        name: 'og:image',
        content: viewModel.socialThumbnail.value.src ?? '',
      });
    }
    return metaProps;
  }

  private async fillSocialMetadata(pageId: string, model: PageSocialMetadataType) {
    while (true) {
      const context = await this.getPageTagging(pageId);

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
        !context?.template?.baseTemplates.some(
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

      pageId = context.parent.id ?? '';
    }
  }
}

const getDirectives = (model: PageSearchEngineDirectivesType) => {
  const directives = [];

  if (model.searchEngineIndexesPage) {
    directives.push('index');
  } else {
    directives.push('noindex');
  }

  if (model.searchEngineFollowsLinks) {
    directives.push('follow');
  } else {
    directives.push('nofollow');
  }

  if (!model.searchEngineIndexesImages) {
    directives.push('noimageindex');
  }

  if (!model.searchEngineCanCachePage) {
    directives.push('noarchive');
    directives.push('nocache');
  }

  if (!model.searchEngineCanSnippetPage) {
    directives.push('nosnippet');
  }

  if (!model.allowODPSnippet) {
    directives.push('noodp');
  }

  return directives;
};

const getContent = (directives: string[]) => {
  const content = directives.join(', ');

  return content;
};
