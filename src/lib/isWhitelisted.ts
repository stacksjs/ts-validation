import assertString from './util/assertString'

/**
 * Check if the string is Whitelisted
 *
 * @param str - The string to check
 * @param chars - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isWhitelisted(str: string, chars: string[]): boolean {
  assertString(str)
  for (let i = str.length - 1; i >= 0; i--) {
    if (!chars.includes(str[i])) {
      return false
    }
  }
  return true
}
