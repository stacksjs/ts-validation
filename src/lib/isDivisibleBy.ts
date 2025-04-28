import toFloat from './toFloat'
import assertString from './util/assertString'

/**
 * Check if the string is DivisibleBy
 *
 * @param str - The string to check
 * @param num - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isDivisibleBy(str, num): boolean {
  assertString(str)
  return toFloat(str) % Number.parseInt(num, 10) === 0
}
