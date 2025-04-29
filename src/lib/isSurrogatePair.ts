import assertString from './util/assertString'

const surrogatePair = /[\uD800-\uDBFF][\uDC00-\uDFFF]/

/**
 * Check if the string is SurrogatePair
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isSurrogatePair(str: string): boolean {
  assertString(str)
  return surrogatePair.test(str)
}
