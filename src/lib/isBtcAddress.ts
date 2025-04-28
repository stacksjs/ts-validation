import assertString from './util/assertString'

const bech32 = /^(bc1|tb1|bc1p|tb1p)[ac-hj-np-z02-9]{39,58}$/
const base58 = /^([123m])[A-HJ-NP-Za-km-z1-9]{25,39}$/

/**
 * Check if the string is BtcAddress
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBtcAddress(str): boolean {
  assertString(str)
  return bech32.test(str) || base58.test(str)
}
