import assertString from './util/assertString'

/**
 * Check if the string is a valid ULID (Universally Unique Lexicographically Sortable Identifier).
 *
 * @param str - The string to check
 * @returns True if the string is a valid ULID, false otherwise
 */
export default function isULID(str: string): boolean {
  assertString(str)
  return /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/i.test(str)
}
