import assertString from './util/assertString'

/**
 * Convert a string to an integer.
 * @param str The string to convert
 * @param radix The radix to use for conversion (default is 10)
 * @returns The integer value if valid, NaN otherwise
 */
export default function toInt(str: string, radix: number = 10): number {
  assertString(str)
  return Number.parseInt(str, radix)
}
