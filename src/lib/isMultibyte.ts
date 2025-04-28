import assertString from './util/assertString'

/* eslint-disable no-control-regex */
const multibyte = /[^\x00-\x7F]/
/* eslint-enable no-control-regex */

/**
 * Check if the string is Multibyte
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMultibyte(str: string) {
  assertString(str)
  return multibyte.test(str)
}
