import assertString from './util/assertString'

const hexcolor = /^#?(?:[0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$/i

/**
 * Check if the string is HexColor
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isHexColor(str: string): boolean {
  assertString(str)
  return hexcolor.test(str)
}
