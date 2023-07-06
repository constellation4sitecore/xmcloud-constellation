// eslint-disable-next-line @next/next/no-document-import-in-page
import { DocumentContext } from 'next/document';

export function getSiteName(ctx: DocumentContext): string | undefined {
  let siteName: string | undefined = '';

  if (ctx.query.path && ctx.query.path.length > 0) {
    siteName = ctx.query.path[0].split('_site_')[1] || undefined;
  }

  return siteName || undefined;
}
