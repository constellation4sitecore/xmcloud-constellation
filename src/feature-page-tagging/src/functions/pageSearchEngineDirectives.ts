import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { PageSearchEngineDirectivesType } from '../models/PageSearchEngineDirectives';
import { getPageTagging } from '../services';

export const pageSearchEngineDirectives = async (pageId: string) => {
  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageSearchEngineDirectivesType>(pageTagging);

  if (model) {
    const directives = getDirectives(model);

    const content = getContent(directives);

    return content;
  }

  return '';
};

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
