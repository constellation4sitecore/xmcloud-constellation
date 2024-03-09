import { gql } from 'graphql-request';
import { DocumentNode } from 'graphql';
import {
  createGraphQLClientFactory,
  debug as debuggers,
  config,
} from '@constellation4sitecore/constellation-sxa-nextjs';
import { mapToNew } from '@constellation4sitecore/foundation-mapper';

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
    id: string;
    fields: {
      name: string;
      value: string;
      jsonValue: unknown;
    }[];
  };
};

export class LabelService {
  private language: string;
  /**
   *
   */
  constructor(language?: string) {
    this.language = language ? language : (config.defaultLanguage as string);
  }

  async getLabelsForView<TLabel extends Obj>(labelId: string): Promise<TLabel | null> {
    const graphqlFactory = createGraphQLClientFactory();
    const graphQLClient = graphqlFactory({
      debugger: debuggers.labels,
    }) as GraphQLClient;

    const query = gql`
      query GetLabels($labelId: String!, $language: String!) {
        labels: item(path: $labelId, language: $language) {
          id
          fields {
            name
            value
            jsonValue
          }
        }
      }
    `;

    const result = await graphQLClient.request<LabelResult>(query, {
      labelId: labelId,
      language: this.language,
    });

    if (!result.labels) {
      debuggers.labels(`No labels found for labelId: ${labelId}. Do you forget to publish?`);
      return null;
    }

    const label = mapToNew<TLabel>(result.labels);
    return label;
  }
}
