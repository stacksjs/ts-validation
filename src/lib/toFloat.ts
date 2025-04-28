import assertString from './util/assertString'

/**
 * Convert a string to a float.
 * @param str The string to convert
 * @returns The float value if valid, NaN otherwise
 */
export default function toFloat(str: string): number {
  assertString(str)
  return Number.parseFloat(str)
}
