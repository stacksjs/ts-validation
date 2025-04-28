import assertString from './util/assertString'

// see http://isrc.ifpi.org/en/isrc-standard/code-syntax
const isrc = /^[A-Z]{2}[0-9A-Z]{3}\d{7}$/

/**
 * Check if the string is ISRC
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isISRC(str: string): boolean {
  assertString(str)
  return isrc.test(str)
}
