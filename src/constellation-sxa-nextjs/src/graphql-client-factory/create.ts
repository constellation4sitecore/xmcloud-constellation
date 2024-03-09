import {
  GraphQLRequestClientFactoryConfig,
  GraphQLRequestClient,
  getEdgeProxyContentUrl,
} from '@sitecore-jss/sitecore-jss-nextjs/graphql';
import config, { JssConfig } from '../config';

/**
 * Creates a new GraphQLRequestClientFactory instance
 * @param config jss config
 * @returns GraphQLRequestClientFactory instance
 */
export const createGraphQLClientFactory = () => {
  let clientConfig: GraphQLRequestClientFactoryConfig;
  const projectConfig = config as JssConfig;
  if (projectConfig.sitecoreEdgeContextId) {
    clientConfig = {
      endpoint: getEdgeProxyContentUrl(
        projectConfig.sitecoreEdgeContextId,
        projectConfig.sitecoreEdgeUrl
      ),
    };
  } else if (projectConfig.graphQLEndpoint && projectConfig.sitecoreApiKey) {
    clientConfig = {
      endpoint: projectConfig.graphQLEndpoint,
      apiKey: projectConfig.sitecoreApiKey,
    };
  } else {
    throw new Error(
      'Please configure either your sitecoreEdgeContextId, or your graphQLEndpoint and sitecoreApiKey.'
    );
  }
  return GraphQLRequestClient.createClientFactory(clientConfig);
};
