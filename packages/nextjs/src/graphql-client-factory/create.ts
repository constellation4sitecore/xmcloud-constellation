import {
  getEdgeProxyContentUrl,
  GraphQLRequestClient,
  GraphQLRequestClientFactory,
  GraphQLRequestClientFactoryConfig,
} from '@sitecore-content-sdk/nextjs/client';
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = () => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  const projectConfig = defineConfig({});
  if (projectConfig.api?.edge?.contextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(
        projectConfig.api?.edge?.contextId,
        projectConfig.api?.edge?.edgeUrl
      ),
    };
  } else if (projectConfig.api?.local?.apiHost && projectConfig.api?.local.apiKey) {
    clientConfig = {
      endpoint: projectConfig.api?.local?.apiHost,
      apiKey: projectConfig.api?.local?.apiKey,
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }
  return GraphQLRequestClient.createClientFactory(clientConfig) as GraphQLRequestClientFactory;
};
