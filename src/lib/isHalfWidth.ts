import assertString from './util/assertString'

const halfWidth: RegExp = /[\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE]/

/**
 * Check if the string is HalfWidth
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isHalfWidth(str: string): boolean {
  assertString(str)
  return halfWidth.test(str)
}
