import isIP from './isIP'
import assertString from './util/assertString'

const subnetMaybe = /^\d{1,3}$/
const v4Subnet = 32
const v6Subnet = 128

interface IsIPOptions {
  version?: number
}

/**
 * Check if the string is IPRange
 *
 * @param str - The string to check
 * @param version - IP version (4 or 6)
 * @returns True if the string matches the validation, false otherwise
 */
export default function isIPRange(str: string, version: number | string = ''): boolean {
  assertString(str)
  const parts = str.split('/')

  // parts[0] -> ip, parts[1] -> subnet
  if (parts.length !== 2) {
    return false
  }

  if (!subnetMaybe.test(parts[1])) {
    return false
  }

  // Disallow preceding 0 i.e. 01, 02, ...
  if (parts[1].length > 1 && parts[1].startsWith('0')) {
    return false
  }

  const options: IsIPOptions = typeof version === 'string' ? { version: Number.parseInt(version, 10) } : { version }
  const isValidIP = isIP(parts[0], options)
  if (!isValidIP) {
    return false
  }

  // Define valid subnet according to IP's version
  let expectedSubnet: number = 0
  const versionStr = String(version)
  if (versionStr === '4') {
    expectedSubnet = v4Subnet
  }
  else if (versionStr === '6') {
    expectedSubnet = v6Subnet
  }
  else {
    const defaultOptions: IsIPOptions = { version: 6 }
    expectedSubnet = isIP(parts[0], defaultOptions) ? v6Subnet : v4Subnet
  }

  const subnet = Number.parseInt(parts[1], 10)
  return subnet <= expectedSubnet && subnet >= 0
}
