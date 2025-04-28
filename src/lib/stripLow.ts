import blacklist from './blacklist'
import assertString from './util/assertString'

/**
 * Remove characters with code points in the range of 0-31 and 127 from the string.
 *
 * @param str - The string to process
 * @param keep_new_lines - If true, new line characters will be preserved
 * @returns The processed string with low ASCII characters removed
 */
export default function stripLow(str: string, keep_new_lines?: boolean): string {
  assertString(str)
  const chars = keep_new_lines ? '\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F' : '\\x00-\\x1F\\x7F'
  return blacklist(str, chars)
}
