import assertString from './util/assertString'

const eth = /^(0x)[0-9a-f]{40}$/i

/**
 * Check if the string is EthereumAddress
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isEthereumAddress(str): boolean {
  assertString(str)
  return eth.test(str)
}
