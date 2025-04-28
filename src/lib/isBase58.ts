import assertString from './util/assertString'

// Accepted chars - 123456789ABCDEFGH JKLMN PQRSTUVWXYZabcdefghijk mnopqrstuvwxyz
const base58Reg = /^[A-HJ-NP-Za-km-z1-9]*$/

/**
 * Check if the string is Base58
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBase58(str): boolean {
  assertString(str)
  if (base58Reg.test(str)) {
    return true
  }
  return false
}
