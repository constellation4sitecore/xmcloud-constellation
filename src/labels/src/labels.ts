import { gql } from 'graphql-request';

import {
  GraphQLClient,
  createGraphQLClientFactory,
  debug as debuggers,
  config,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { mapToNew } from '@constellation4sitecore/mapper';
import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';

// https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build
// .d.ts workaraound
type Obj = { [key: string]: unknown };

type HomeItem = {
  name: string;
  parent: {
    path: string;
  };
};

type LabelResult = {
  labels: {
    results: {
      name: string;
      path: string;
      fields: {
        name: string;
        jsonValue: unknown;
      }[];
    }[];
  };
  siteRoot?: {
    name: string;
    parent: {
      path: string;
    };
    ancestors: {
      name: string;
      parent: {
        path: string;
      };
    }[];
  };
};

export class LabelService {
  private language: string;
  private contextItem: string | null;

  /**
   * Initialize the label service
   * @param layoutData : Layout service data
   */
  constructor(layoutData?: LayoutServiceData) {
    this.language = layoutData?.sitecore.context.language
      ? layoutData?.sitecore.context.language
      : (config.defaultLanguage as string);

    this.contextItem = layoutData?.sitecore.route?.itemId ? layoutData.sitecore.route.itemId : null;
  }

  /**
   * Get labels for a given template ID
   * @param templateId : Template ID of the labels
   * @returns Labels
   */
  async getLabelsForView<TLabel extends Obj>(templateId: string): Promise<TLabel | null> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.labels,
    }) as GraphQLClient;

    const query = gql`
      query getLabelsForView($contextItem: String, $labelsTemplate: String!, $language: String!) {
        labels: search(
          where: {
            AND: [
              { name: "_templates", value: $labelsTemplate }
              { name: "_name", value: "__Standard Values", operator: NEQ }
              { name: "_language", value: $language }
            ]
          }
        ) {
          results {
            name
            path
            fields {
              name
              jsonValue
            }
          }
        }
        siteRoot: item(path: $contextItem, language: $language) {
          name
          parent {
            path
          }
          ancestors(hasLayout: true) {
            name
            parent {
              path
            }
          }
        }
      }
    `;

    try {
      const result = await graphQLClient.request<LabelResult>(query, {
        contextItem: this.contextItem,
        labelsTemplate: templateId,
        language: this.language,
      });

      if (result.labels.results.length == 0) {
        debuggers.labels(
          `No labels found for templateId: ${templateId}. Did you forget to publish?`
        );
        return null;
      }

      let home = result.siteRoot?.ancestors.find(
        (ancestor: any) => ancestor.name.toLowerCase() === 'home'
      ) as HomeItem | undefined;
      if (!home) {
        home = result.siteRoot?.name.toLowerCase() === 'home' ? result.siteRoot : undefined;
      }

      const parentPath = home?.parent.path ?? null;
      const labelItem = parentPath
        ? result.labels.results.filter((label) => label.path.startsWith(parentPath))[0]
        : result.labels.results[0];
      const label = mapToNew<TLabel>(labelItem);
      return label;
    } catch (error) {
      debuggers.labels(
        `Error fetching labels for templateId: ${templateId}. Verify that template exists. Error: ${error}`
      );
      return null;
    }
  }
}
