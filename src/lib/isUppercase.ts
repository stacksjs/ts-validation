import assertString from './util/assertString'

/**
 * Check if a string is uppercase.
 *
 * @param str - The string to check
 * @returns True if the string is uppercase, false otherwise
 */
export default function isUppercase(str: string): boolean {
  assertString(str)
  return str === str.toUpperCase()
}
