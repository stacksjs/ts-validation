import assertString from './util/assertString'

/**
 * escape
 *
 * @param str - The string to check
 * @returns The processed string
 */
export default function escape(str): string {
  assertString(str)
  return (str.replace(/&/g, '&amp')
    .replace(/"/g, '&quot')
    .replace(/'/g, '&#x27')
    .replace(/</g, '&lt')
    .replace(/>/g, '&gt')
    .replace(/\//g, '&#x2F')
    .replace(/\\/g, '&#x5C')
    .replace(/`/g, '&#96'))
}
