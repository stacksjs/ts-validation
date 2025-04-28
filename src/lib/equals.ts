import assertString from './util/assertString'

/**
 * equals
 *
 * @param str - The string to check
 * @param comparison - Options object
 * @returns The processed string
 */
export default function equals(str: string, comparison: string): boolean {
  assertString(str)
  return str === comparison
}
