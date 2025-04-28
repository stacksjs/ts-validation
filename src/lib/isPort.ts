import isInt from './isInt'

/**
 * Check if the string is Port
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isPort(str: string) {
  return isInt(str, { allow_leading_zeroes: false, min: 0, max: 65535 })
}
