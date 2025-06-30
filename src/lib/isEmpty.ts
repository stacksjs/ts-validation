import type { IsEmptyOptions } from '../types'
import assertString from './util/assertString'

/**
 * Check if the string is empty.
 * @param str The string to check
 * @param options Options object
 * @returns True if the string is empty, false otherwise
 */
export default function isEmpty(str: string, options: IsEmptyOptions = {}): boolean {
  assertString(str)

  return (options?.ignoreWhitespace ? str.trim().length : str.length) === 0
}
