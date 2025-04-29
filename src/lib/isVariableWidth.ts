import { fullWidth } from './isFullWidth'

import { halfWidth } from './isHalfWidth'
import assertString from './util/assertString'

/**
 * Check if the string is VariableWidth
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isVariableWidth(str: string): boolean {
  assertString(str)
  return fullWidth.test(str) && halfWidth.test(str)
}
