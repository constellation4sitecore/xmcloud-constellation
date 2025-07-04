import debug from 'debug';
import isServer from './utils/is-server';

const rootNamespace = 'constellation-sxa-nextjs';

export type Debugger = debug.Debugger;

// On server/node side, allow switching from the built-in
// `%o` (pretty-print single line) and `%O` (pretty-print multiple line)
// with a `DEBUG_MULTILINE` environment variable.
if (
  isServer() &&
  process?.env?.DEBUG_MULTILINE === 'true' &&
  debug.formatters.o &&
  debug.formatters.O
) {
  debug.formatters.o = debug.formatters.O;
}

/**
 * Enable debug logging dynamically
 * @param {string} namespaces space-separated list of namespaces to enable
 */
export const enableDebug = (namespaces: string) => debug.enable(namespaces);

/**
 * Default Sitecore JSS 'debug' module debuggers. Uses namespace prefix 'sitecore-jss:'.
 * See {@link https://www.npmjs.com/package/debug} for details.
 */
export default {
  common: debug(`${rootNamespace}:common`),
  labels: debug(`${rootNamespace}:labels`),
  navigation: debug(`${rootNamespace}:navigation`),
  data: debug(`${rootNamespace}:data`),
  analytics: debug(`${rootNamespace}:analytics`),
  security: debug(`${rootNamespace}:security`),
  http: debug(`${rootNamespace}:http`),
};
