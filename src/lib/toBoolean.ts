import assertString from './util/assertString'

/**
 * Convert a string to a boolean.
 * @param str The string to convert
 * @param strict If true, only 'true' and 'false' are valid (case-insensitive)
 * @returns The boolean value
 */
export default function toBoolean(str: string, strict: boolean = false): boolean {
  assertString(str)

  if (strict) {
    return str === 'true'
  }

  return str !== '0' && str !== 'false' && str !== ''
}
