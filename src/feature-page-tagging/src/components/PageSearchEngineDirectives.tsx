import { withDatasourceRendering } from '@constellation4sitecore/foundation-enhancers';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { ComponentRendering, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageSearchEngineDirectivesType } from '../models/PageSearchEngineDirectives';
import { getPageTagging } from '../services';

type PageSearchEngineDirectiveProps = ComponentProps & {
  pageSearchEngineDirectives: string;
};

const PageSearchEngineDirectives = ({
  pageSearchEngineDirectives,
}: PageSearchEngineDirectiveProps): JSX.Element => {
  return (
    <>
      <Head>
        <meta name="robots" content={pageSearchEngineDirectives} />
      </Head>
    </>
  );
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

export const getStaticProps = async (_: ComponentRendering, layoutData: LayoutServiceData) => {
  const pageId = layoutData.sitecore.route?.itemId as string;
  const pageTagging = await getPageTagging(pageId);

  const model = mapToNew<PageSearchEngineDirectivesType>(pageTagging);

  if (model) {
    const directives = getDirectives(model);

    const content = getContent(directives);
    return {
      pageSearchEngineDirectives: content,
    };
  }

  return {
    pageSearchEngineDirectives: '',
  };
};

export default withDatasourceRendering()<PageSearchEngineDirectiveProps>(
  PageSearchEngineDirectives
);
