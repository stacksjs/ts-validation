import assertString from './util/assertString'

/**
 * Check if a string is lowercase.
 *
 * @param str - The string to check
 * @returns True if the string is lowercase, false otherwise
 */
export default function isLowercase(str: string): boolean {
  assertString(str)
  return str === str.toLowerCase()
}
