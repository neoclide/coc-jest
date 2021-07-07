/** 
 * Escape characters with special meaning either inside or outside character sets.
 * Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed
 * by Unicode patterns’ stricter grammar.
 * Source: https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
 */
export const escapeStringRegexp = (s: string) =>
  s
    .replace(/[|\\{}()[\]^$+*?.']/g, '\\$&')
    .replace(/-/g, '\\x2d')

