import isHexadecimal from './isHexadecimal'

import assertString from './util/assertString'

/**
 * Check if the string is MongoId
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMongoId(str: string): boolean {
  assertString(str)
  return isHexadecimal(str) && str.length === 24
}
