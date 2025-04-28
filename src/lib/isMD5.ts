import assertString from './util/assertString'

const md5 = /^[a-f0-9]{32}$/

/**
 * Check if the string is MD5
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMD5(str: string) {
  assertString(str)
  return md5.test(str)
}
