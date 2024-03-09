import { gql } from 'graphql-request';
import { DocumentNode } from 'graphql';
import {
  createGraphQLClientFactory,
  debug as debuggers,
  config,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';
import { LayoutServiceData } from '@sitecore-jss/sitecore-jss-nextjs';

// https://stackoverflow.com/questions/56018167/typescript-does-not-copy-d-ts-files-to-build
// .d.ts workaraound
type Obj = { [key: string]: unknown };

/**
 * An interface for GraphQL clients for Content Hub APIs
 */
export interface GraphQLClient {
  /**
   * Execute graphql request
   * @param {string | DocumentNode} query graphql query
   * @param {Object} variables graphql variables
   */
  request<T>(
    query: string | DocumentNode,
    variables?: {
      [key: string]: unknown;
    }
  ): Promise<T>;
}

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
            ]
          }
        ) {
          results {
            name
            path
            fields(ownFields: true) {
              name
              jsonValue
            }
          }
        }
        siteRoot: item(path: $contextItem, language: $language) {
          ancestors(hasLayout: true) {
            name
            parent {
              path
            }
          }
        }
      }
    `;

    const result = await graphQLClient.request<LabelResult>(query, {
      contextItem: this.contextItem,
      labelsTemplate: templateId,
      language: this.language,
    });

    if (result.labels.results.length == 0) {
      debuggers.labels.log(
        `No labels found for labelId: ${templateId}. Did you forget to publish?`
      );
      return null;
    }

    const home = result.siteRoot?.ancestors.find(
      (ancestor: any) => ancestor.name.toLowerCase() === 'home'
    );
    const labelItem = home
      ? result.labels.results.filter((label) => label.path.startsWith(home.parent.path))[0]
      : result.labels.results[0];
    const label = mapToNew<TLabel>(labelItem);
    return label;
  }
}
