import assertString from './util/assertString'

/* eslint-disable no-control-regex */
const ascii = /^[\x00-\x7F]+$/
/* eslint-enable no-control-regex */

/**
 * Check if the string is Ascii
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isAscii(str): boolean {
  assertString(str)
  return ascii.test(str)
}
