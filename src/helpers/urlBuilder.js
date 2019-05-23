import queryString from 'query-string';

function toArray(val) {
  return Object.prototype.toString.call(val) !== '[object Array]' ? [val] : val;
}

// "/some//path"
const reRepeatingSlashes = /\/+/g;
// "/some/*/complex/**/path"
const reSplatParams = /\*{1,2}/g;
// "/path/with/(resolved/params)"
const reResolvedOptionalParams = /\(([^:*?#]+?)\)/g;
// "/path/with/(groups/containing/:unresolved/optional/:params)"
const reUnresolvedOptionalParams = /\([^:?#]*:[^?#]*?\)/g;
// "/path/with/groups/containing/unresolved?/optional/params?"
const reUnresolvedOptionalParamsRR4 = /(\/[^\/]*\?)/g; // eslint-disable-line
const reTokens = /<(.*?)>/g;
const reSlashTokens = /_!slash!_/g;

export function getUrl(routePath, params) {
  const tokens = {};

  if (params) {
    // eslint-disable-next-line
    for (const paramName in params) {
      // eslint-disable-next-line
      if (params.hasOwnProperty(paramName)) {
        let paramValue = params[paramName];

        if (paramName === 'splat') {
          // special param name in RR, used for "*" and "**" placeholders
          paramValue = toArray(paramValue); // when there are multiple globs, RR defines "splat" param as array.
          let i = 0;
          // eslint-disable-next-line
          routePath = routePath.replace(reSplatParams, match => {
            const val = paramValue[i++];

            if (val == null) {
              return '';
            }
            const tokenName = `splat${ i }`;

            tokens[tokenName] = match === '*'
              ? encodeURIComponent(val) // don't escape slashes for double star, as "**" considered greedy by RR spec
              : encodeURIComponent(val.toString().replace(/\//g, '_!slash!_')).replace(reSlashTokens, '/');

            return `<${ tokenName }>`;
          });
        } else {
          // Rougly resolve all named placeholders.
          // Cases:
          // - "/path/:param"
          // - "/path/(:param)"
          // - "/path(/:param)"
          // - "/path(/:param/):another_param"
          // - "/path/:param(/:another_param)"
          // - "/path(/:param/:another_param)"
          const paramRegex = new RegExp(`(/|\\(|\\)|^):${ paramName }(/|\\)|\\(|$)`);
          // eslint-disable-next-line
          routePath = routePath.replace(paramRegex, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);

            return `${ g1 }<${ paramName }>${ g2 }`;
          });
          const paramRegexRR4 = new RegExp(`(.*):${ paramName }\\?(.*)`);
          // eslint-disable-next-line
          routePath = routePath.replace(paramRegexRR4, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);

            return `${ g1 }<${ paramName }>${ g2 }`;
          });
        }
      }
    }
  }

  return (
    routePath
      // Remove braces around resolved optional params (i.e. "/path/(value)")
      .replace(reResolvedOptionalParams, '$1')
      // Remove all sequences containing at least one unresolved optional param
      .replace(reUnresolvedOptionalParams, '')
      // Remove all sequences containing at least one unresolved optional param in RR4
      .replace(reUnresolvedOptionalParamsRR4, '')
      // After everything related to RR syntax is removed, insert actual values
      .replace(reTokens, (match, token) => tokens[token])
      // Remove repeating slashes
      .replace(reRepeatingSlashes, '/')
      // If there was a single slash only, keep it
      .replace(/^$/, '/')
  );
}

/**
 * Получить API URL с подставленными параметрами.
 * То же самое, что getUrl, только вначале добавляется host,
 * если он указан в переменной __HOST__ (то есть при запуске на сервере)
 *
 * @example
 * // API.GET_ITEM_BY_ID = '/api/entities/v1/items/:id/'
 * getUrl(API.GET_ITEM_BY_ID, { id: 123, query: { nocache: true, sessionId: 12345 } })
 * // -> '/api/entities/v1/items/123/?nocache=true&sessionId=12345'
 *
 * @param  {Object} route       Базовый URL запроса
 * @param  {Object} [params={}] Параметры запроса для подстановки
 * @return {String}             URL с подставленными параметрами
 */
export function getApiUrl({ path, method }, opts = {}) {
  const { query, ...params } = opts;
  const url = `${ getUrl(path, params) }/${ query ? `?${ queryString.stringify(query) }` : '' }`;

  return { url, method };
}
