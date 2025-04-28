import assertString from './util/assertString'

const hexadecimal = /^(0x|0h)?[0-9A-F]+$/i

/**
 * Check if the string is Hexadecimal
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isHexadecimal(str): boolean {
  assertString(str)
  return hexadecimal.test(str)
}
