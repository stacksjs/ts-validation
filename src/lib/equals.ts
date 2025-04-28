import assertString from './util/assertString'

/**
 * equals
 *
 * @param str - The string to check
 * @param comparison - Options object
 * @returns The processed string
 */
export default function equals(str, comparison): boolean {
  assertString(str)
  return str === comparison
}
