# Constellation Security

## Content Security Policy

Add NPM

```bash
npm i @constellation4sitecore/security --save
```

Serialize Items

```bash
npm@constellation4sitecore/security
```

Add CSP Middleware Plugin under `lib/middleware/plugins/csp.ts`

```ts
import { NextRequest, NextResponse } from 'next/server';
import { MiddlewarePlugin } from '..';
import { CSPMiddleware } from '@constellation4sitecore/security/middleware';
import { siteResolver } from 'lib/site-resolver';
import clientFactory from 'lib/graphql-client-factory';

class ContentSecurityPolicyPlugin implements MiddlewarePlugin {
  private cspMiddleware: CSPMiddleware;
  order = 2;

  constructor() {
    this.cspMiddleware = new CSPMiddleware({
      clientFactory,
      siteResolver,
      cacheEnabled: true,
      cacheTimeout: 86400, // Cache
      disabled: () => process.env.NODE_ENV === 'development',
    });
  }

  /**
   * exec async method - to find coincidence in url.pathname and redirects of site
   * @param req<NextRequest>
   * @returns Promise<NextResponse>
   */
  async exec(req: NextRequest, res?: NextResponse): Promise<NextResponse> {
    return this.cspMiddleware.getHandler()(req, res);
  }
}

export const cspPlugin = new ContentSecurityPolicyPlugin();
```

Create a report under `pages/api/cspreports.ts`

```ts
import type { NextApiRequest, NextApiResponse } from 'next';
import debuggers from '../../debug';

const cspReportsApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  res.setHeader('Content-Type', 'text/plain');

  debuggers.csp('CSP Report:', req.body);

  return res.status(200).send({ success: true });
};

export default cspReportsApi;
```

Add Rewrite plugin `lib/next-config/plugins/csreports.js`

```js
/**
 * @param {import('next').NextConfig} nextConfig
 */
const cspReportsPlugin = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    async rewrites() {
      return [
        ...(await nextConfig.rewrites()),
        // cspReports route
        {
          source: '/cspreports.xml',
          destination: '/api/cspreports',
        },
      ];
    },
  });
};

module.exports = cspReportsPlugin;
```

Remove cspreports.xml from Edge middleware. add cspreports.xml to the matcher array in middleware.ts

### Experimental

In order to use next/cache which is not stable yet. Set the following env variable

```bash
CONSTELLATION_NEXT_CACHE_ENABLED=true
```
