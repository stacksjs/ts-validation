import assertString from './util/assertString'
import merge from './util/merge'

export interface IsFQDNOptions {
  allow_trailing_dot?: boolean | string
  allow_wildcard?: boolean | string
  require_tld?: boolean | string
  allow_numeric_tld?: boolean | string
  ignore_max_length?: number
  allow_underscores?: boolean | string
}

const default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_numeric_tld: false,
  allow_wildcard: false,
  ignore_max_length: false,
}

/**
 * Check if the string is FQDN
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isFQDN(str: string, options: IsFQDNOptions = {}): boolean {
  assertString(str)
  options = merge(options, default_fqdn_options)

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1)
  }

  /* Remove the optional wildcard before checking validity */
  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2)
  }

  const parts = str.split('.')
  const tld = parts[parts.length - 1]

  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false
    }

    if (!options.allow_numeric_tld && !/^(?:[a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false
    }

    // disallow spaces
    if (/\s/.test(tld)) {
      return false
    }
  }

  // reject numeric TLDs
  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false
  }

  return parts.every((part) => {
    if (part.length > 63 && !options.ignore_max_length) {
      return false
    }

    if (!/^[\w\u00A1-\uFFFF-]+$/.test(part)) {
      return false
    }

    // disallow full-width chars
    if (/[\uFF01-\uFF5E]/.test(part)) {
      return false
    }

    // disallow parts starting or ending with hyphen
    if (/^-|-$/.test(part)) {
      return false
    }

    if (!options.allow_underscores && /_/.test(part)) {
      return false
    }

    return true
  })
}
