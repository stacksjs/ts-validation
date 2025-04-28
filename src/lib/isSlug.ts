import assertString from './util/assertString'

const charsetRegex = /^[^\s\-_](?!.*?[\-_]{2,})[a-z0-9\-\\]\S*[^\-_\s]$/

/**
 * Check if the string is a valid slug.
 *
 * @param str - The string to check
 * @returns True if the string is a valid slug, false otherwise
 */
export default function isSlug(str: string): boolean {
  assertString(str)
  return charsetRegex.test(str)
}
