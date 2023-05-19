import { constants, GraphQLRequestClient } from '@sitecore-jss/sitecore-jss-nextjs';
import config from '../../../../../src/temp/config';
import { gql } from 'graphql-request';

export async function getLabelsForView(labelId) {
  if (process.env.JSS_MODE === constants.JSS_MODE.DISCONNECTED) {
    return null;
  }

  const graphQLClient = new GraphQLRequestClient(config.graphQLEndpoint, {
    apiKey: config.sitecoreApiKey,
  });

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

  const result = await graphQLClient.request(query, {
    labelId: labelId,
    language: config.defaultLanguage,
  });

  const objArray = result.labels.fields.map((field) => {
    const obj = {};
    obj[field.name] = field.jsonValue;
    return obj;
  });

  const model = {};
  objArray.forEach((obj) => {
    Object.assign(model, obj);
  });

  return model;
}
