import { DocumentNode } from 'graphql';
/**
 * An interface for GraphQL clients
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
