import isByteLength from './isByteLength'
import isFQDN from './isFQDN'

import isIP from './isIP'
import assertString from './util/assertString'
import checkHost from './util/checkHost'
import merge from './util/merge'

const default_email_options = {
  allow_display_name: false,
  allow_underscores: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  blacklisted_chars: '',
  ignore_max_length: false,
  host_blacklist: [],
  host_whitelist: [],
}

/* eslint-disable no-control-regex */
const splitNameAddress = /^([^\x00-\x1F\x7F-\x9F]+)</
const emailUserPart = /^[\w!#$%&'*+\-/=?^`{|}~]+$/
const gmailUserPart = /^[a-z\d]+$/
const quotedEmailUser = /^(?:[\s\x01-\x08\x0E-\x1F\x7F\x21\x23-\x5B\x5D-\x7E]|\\[\x01-\x09\v\f\x0D-\x7F])*$/i
const emailUserUtf8Part = /^[\w!#$%&'*+\-/=?^`{|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/
const quotedEmailUserUtf8 = /^(?:[\t\n\v\f\r \x01-\x08\x0E-\x1F\x7F\x21\x23-\x5B\x5D-\x7E\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\v\f\x0D-\x7F\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*$/i
const defaultMaxEmailLength = 254

/* eslint-enable no-control-regex */

/**
 * Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
 * @param {string} display_name
 */
function validateDisplayName(display_name: string): boolean {
  const display_name_without_quotes = display_name.replace(/^"(.+)"$/, '$1')
  // display name with only spaces is not valid
  if (!display_name_without_quotes.trim()) {
    return false
  }

  // check whether display name contains illegal character
  const contains_illegal = /[.";<>]/.test(display_name_without_quotes)
  if (contains_illegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (display_name_without_quotes === display_name) {
      return false
    }

    // the quotes in display name must start with character symbol \
    const all_start_with_back_slash
      = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length
    if (!all_start_with_back_slash) {
      return false
    }
  }

  return true
}

export default function isEmail(str: string, options: any = {}): boolean {
  assertString(str)
  options = merge(options, default_email_options)

  if (options.require_display_name || options.allow_display_name) {
    const display_email = str.match(splitNameAddress)
    if (display_email) {
      let display_name = display_email[1]

      // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)
      str = str.replace(display_name, '').replace(/(^<|>$)/g, '')

      // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space
      if (display_name.endsWith(' ')) {
        display_name = display_name.slice(0, -1)
      }

      if (!validateDisplayName(display_name)) {
        return false
      }
    }
    else if (options.require_display_name) {
      return false
    }
  }
  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false
  }

  const parts = str.split('@')
  const domain = parts.pop()
  if (!domain)
    return false
  const lower_domain = domain.toLowerCase()

  if (options.host_blacklist.length > 0 && checkHost(lower_domain, options.host_blacklist)) {
    return false
  }

  if (options.host_whitelist.length > 0 && !checkHost(lower_domain, options.host_whitelist)) {
    return false
  }

  let user = parts.join('@')

  if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
    /*
    Previously we removed dots for gmail addresses before validating.
    This was removed because it allows `multiple..dots@gmail.com`
    to be reported as valid, but it is not.
    Gmail only normalizes single dots, removing them from here is pointless,
    should be done in normalizeEmail
    */
    user = user.toLowerCase()

    // Removing sub-address from username before gmail validation
    const username = user.split('+')[0]

    // Dots are not included in gmail length restriction
    if (!isByteLength(username.replace(/\./g, ''), { min: 6, max: 30 })) {
      return false
    }

    const user_parts = username.split('.')
    for (let i = 0; i < user_parts.length; i++) {
      if (!gmailUserPart.test(user_parts[i])) {
        return false
      }
    }
  }

  if (options.ignore_max_length === false && (
    !isByteLength(user, { max: 64 })
    || !isByteLength(domain, { max: 254 }))
  ) {
    return false
  }

  if (!isFQDN(domain, {
    require_tld: options.require_tld,
    ignore_max_length: options.ignore_max_length,
    allow_underscores: options.allow_underscores,
  })) {
    if (!options.allow_ip_domain) {
      return false
    }

    if (!isIP(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false
      }

      const noBracketdomain = domain.slice(1, -1)

      if (noBracketdomain.length === 0 || !isIP(noBracketdomain)) {
        return false
      }
    }
  }

  if (options.blacklisted_chars) {
    if (user.search(new RegExp(`[${options.blacklisted_chars}]+`, 'g')) !== -1)
      return false
  }

  if (user[0] === '"' && user[user.length - 1] === '"') {
    user = user.slice(1, user.length - 1)
    return options.allow_utf8_local_part
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user)
  }

  const pattern = options.allow_utf8_local_part
    ? emailUserUtf8Part
    : emailUserPart

  const user_parts = user.split('.')
  for (let i = 0; i < user_parts.length; i++) {
    if (!pattern.test(user_parts[i])) {
      return false
    }
  }

  return true
}
