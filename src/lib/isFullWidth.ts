import assertString from './util/assertString'

const fullWidth: RegExp = /[^\u0020-\u007E\uFF61-\uFF9F\uFFA0-\uFFDC\uFFE8-\uFFEE]/

/**
 * Check if the string is FullWidth
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isFullWidth(str: string): boolean {
  assertString(str)
  return fullWidth.test(str)
}
