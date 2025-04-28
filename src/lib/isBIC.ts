import { CountryCodes } from './isISO31661Alpha2'
import assertString from './util/assertString'

// https://en.wikipedia.org/wiki/ISO_9362
const isBICReg = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i

/**
 * Check if the string is BIC
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBIC(str): boolean {
  assertString(str)

  // toUpperCase() should be removed when a new major version goes out that changes
  // the regex to [A-Z] (per the spec).
  const countryCode = str.slice(4, 6).toUpperCase()

  if (!CountryCodes.has(countryCode) && countryCode !== 'XK') {
    return false
  }

  return isBICReg.test(str)
}
