import assertString from './util/assertString'
import merge from './util/merge'

export interface IsBase32Options {
  crockford?: boolean | string
}

const base32 = /^[A-Z2-7]+=*$/
const crockfordBase32 = /^[A-HJKMNP-TV-Z0-9]+$/

const defaultBase32Options = {
  crockford: false,
}

/**
 * Check if the string is Base32
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBase32(str: string, options: IsBase32Options): boolean {
  assertString(str)
  options = merge(options, defaultBase32Options)

  if (options.crockford) {
    return crockfordBase32.test(str)
  }

  const len = str.length
  if (len % 8 === 0 && base32.test(str)) {
    return true
  }
  return false
}
