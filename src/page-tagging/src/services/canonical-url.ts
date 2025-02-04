import { config } from '@constellation4sitecore/constellation-sxa-nextjs';
import { GetStaticPropsContext } from 'next';
import { removeLanguageFromUrl, removeTrailingSlash } from '../helpers/url';

export class CanonicalUrlService {
  context: GetStaticPropsContext;

  constructor(context: GetStaticPropsContext) {
    this.context = context;
  }
  getUrl(options?: { languageEmbedding: boolean }): string {
    const { publicUrl } = config;
    const languageEmbedding = options?.languageEmbedding !== false;
    const languagePath = languageEmbedding ? `${this.context.locale}/` : '';
    const relativeUrl = this.getRelativeUrl();
    return removeTrailingSlash(`${publicUrl}/${languagePath}${relativeUrl}`);
  }

  getRelativeUrl(): string {
    if (this.context.params?.overrideUrl) {
      return removeLanguageFromUrl(this.context.params.overrideUrl as string);
    }
    let paths = (this.context.params?.path as string[]) ?? [];
    if (paths.length > 0) {
      if (typeof paths == 'string') {
        const path = paths as unknown as string;
        paths = [this.context.locales?.includes(path) ? '' : path];
      } else {
        paths = paths.filter((path) => this.context.locales?.includes(path) === false);
      }
      paths = paths.filter((path) => !path.startsWith('_site_'));
    }
    let path = paths.join('/');
    if (path.startsWith('/')) {
      path = path.substring(1);
    }
    return path;
  }
}
