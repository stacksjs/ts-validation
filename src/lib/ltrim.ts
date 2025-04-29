import assertString from './util/assertString'

/**
 * ltrim
 *
 * @param str - The string to check
 * @param chars - Options object
 * @returns The processed string
 */
export default function ltrim(str: string, chars: string): string {
  assertString(str)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
  const pattern = chars ? new RegExp(`^[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+`, 'g') : /^\s+/g
  return str.replace(pattern, '')
}
