/*
 * Represents the type of config object available within the generated temp/config.js in project
 */
export interface JssConfig extends Record<string, string | undefined> {
  sitecoreApiKey?: string;
  sitecoreApiHost?: string;
  sitecoreSiteName?: string;
  graphQLEndpointPath?: string;
  defaultLanguage?: string;
  graphQLEndpoint?: string;
  layoutServiceConfigurationName?: string;
  publicUrl?: string;
}

export const config: JssConfig;
