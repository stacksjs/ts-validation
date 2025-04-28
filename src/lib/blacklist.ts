import assertString from './util/assertString'

/**
 * blacklist
 *
 * @param str - The string to check
 * @param chars - Options object
 * @returns The processed string
 */
export default function blacklist(str: string, chars: string): string {
  assertString(str)
  return str.replace(new RegExp(`[${chars}]+`, 'g'), '')
}
