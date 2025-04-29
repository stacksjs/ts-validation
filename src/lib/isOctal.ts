import assertString from './util/assertString'

const octal = /^(0o)?[0-7]+$/i

/**
 * Check if the string is Octal
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isOctal(str: string): boolean {
  assertString(str)
  return octal.test(str)
}
