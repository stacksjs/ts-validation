import assertString from './util/assertString'

/**
 * unescape
 *
 * @param str - The string to check
 * @returns The processed string
 */
export default function unescape(str: string) {
  assertString(str)
  return (str.replace(/&quot/g, '"')
    .replace(/&#x27/g, '\'')
    .replace(/&lt/g, '<')
    .replace(/&gt/g, '>')
    .replace(/&#x2F/g, '/')
    .replace(/&#x5C/g, '\\')
    .replace(/&#96/g, '`')
    .replace(/&amp/g, '&'))
  // &amp replacement has to be the last one to prevent
  // bugs with intermediate strings containing escape sequences
  // See: https://github.com/validatorjs/validator.js/issues/1827
}
