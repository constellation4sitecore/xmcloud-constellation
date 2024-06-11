import { withDatasourceRendering } from '@constellation4sitecore/enhancers';
import { castItem } from '@constellation4sitecore/mapper';
import { ComponentRendering, Item, LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';
import Head from 'next/head';
import React from 'react';
import { ComponentProps } from '../lib/component-props';
import { PageSearchEngineDirectivesType } from '../models/PageSearchEngineDirectives';

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
  const model = castItem<PageSearchEngineDirectivesType>(layoutData.sitecore.route as Item);

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
