import { GraphqlService } from '@constellation4sitecore/constellation-sxa-nextjs';
import { gql } from 'graphql-request';
import { LayoutServiceData, SiteInfo } from '@sitecore-jss/sitecore-jss-nextjs';
import { AnalyticScriptItem, AnalyticScripts } from '../models';

export class AnalyticsService extends GraphqlService {
  private sitecoreRootPath: string;

  constructor(appName: string, siteInfo: SiteInfo, layoutData: LayoutServiceData) {
    super(layoutData);
    this.sitecoreRootPath = this.buildSitecoreRootPath(appName, siteInfo);
  }

  private buildSitecoreRootPath(appName: string, siteInfo: SiteInfo): string {
    return `/sitecore/content/${appName}/${siteInfo.name}`;
  }

  async buildAnalyticScriptsProps(componentProps: { [key: string]: unknown }): Promise<{
    [key: string]: unknown;
  }> {
    try {
      if (!componentProps) {
        componentProps = {};
      }
      const analyticsScripts = await this.getAnalyticsScripts();
      componentProps['analyticScripts'] = analyticsScripts;
    } catch (error) {
      console.error('Error building analytics scripts props:', error);
      componentProps['analyticScripts'] = { error: `${error}` };
    }
    return componentProps;
  }

  async getAnalyticsScripts(): Promise<AnalyticScripts> {
    const headScripts = await this.getAnalyticsScriptPart(
      `${this.sitecoreRootPath}/Analytics/Head Scripts`
    );
    const topBodyScripts = await this.getAnalyticsScriptPart(
      `${this.sitecoreRootPath}/Analytics/Body Top Scripts`
    );
    const bottomBodyScripts = await this.getAnalyticsScriptPart(
      `${this.sitecoreRootPath}/Analytics/Body Bottom Scripts`
    );
    return { headScripts, topBodyScripts, bottomBodyScripts };
  }

  async getAnalyticsScriptPart(folderId: string): Promise<AnalyticScriptItem[]> {
    const client = this.getClient();

    const query = gql`
      query GetAnalyticsScripts($datasourceId: String!, $language: String!) {
        item: item(path: $datasourceId, language: $language) {
          children {
            results {
              id
              template {
                id
              }
              fields {
                name
                jsonValue
              }
            }
          }
        }
      }
    `;

    const result = (await client.request(query, {
      datasourceId: folderId,
      language: this.language,
    })) as AnalyticResult;

    return result?.item?.children?.results || [];
  }
}

type AnalyticResult = {
  item: {
    children: {
      results: AnalyticScriptItem[];
    };
  };
};
