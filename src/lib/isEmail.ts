import type { EmailOptions } from './types'
import isIP from './isIP'
import assertString from './util/assertString'
import merge from './util/merge'

export interface IsEmailOptions {
  require_display_name?: boolean | string
  allow_display_name?: boolean | string
  ignore_max_length?: number
  allow_utf8_local_part?: boolean | string
  blacklisted_chars?: boolean | string
  domain_specific_validation?: boolean | string
  allow_ip_domain?: boolean | string
  require_tld?: boolean | string
}


const defaultEmailOptions: EmailOptions = {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  ignore_max_length: false,
  allow_ip_domain: false,
  domain_specific_validation: false,
  blacklisted_chars: ''
}

/* eslint-disable no-control-regex */
const splitNameAddress = /^([^\x00-\x1F\x7F-\x9F]+)</
const emailUserPart = /^[\w!#$%&'*+\-/=?^`{|}~]+$/
const gmailUserPart = /^[a-z\d]+$/
const quotedEmailUser = /^([\s\x01-\x08\x0E-\x1F\x7F\x21\x23-\x5B\x5D-\x7E]|(\\[\x01-\x09\v\f\x0D-\x7F]))*$/i
const emailUserUtf8Part = /^[\w!#$%&'*+\-/=?^`{|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/
const quotedEmailUserUtf8 = /^([\s\x01-\x08\x0E-\x1F\x7F\x21\x23-\x5B\x5D-\x7E\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\v\f\x0D-\x7F\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i

/* eslint-enable no-control-regex */

const defaultMaxEmailLength = 254

/**
 * Validate if a string is an email.
 * @param str The email to validate
 * @param options Options object
 * @returns True if the string is an email, false otherwise
 */
export default function isEmail(str: string, options: IsEmailOptions: EmailOptions = {}): boolean {
  assertString(str)

  options = merge(options, defaultEmailOptions)

  if (options.require_display_name || options.allow_display_name) {
    const display_email = str.match(splitNameAddress)
    if (display_email) {
      let display_name = display_email[1]

      // Remove display name and angle brackets to get email address
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
  const user = parts.join('@')

  if (!validateUser(user, options)) {
    return false
  }

  if (!validateDomain(domain || '', options)) {
    return false
  }

  return true
}

/**
 * Validate the display name part of an email
 * @param display_name The display name to validate
 * @returns True if the display name is valid, false otherwise
 */
function validateDisplayName(display_name: string): boolean {
  const display_name_without_quotes = display_name.replace(/^".*"$/, match => match.slice(1, -1))
  // Display name with only spaces is not valid
  if (!display_name_without_quotes.trim()) {
    return false
  }

  // Check if contains a double quote
  // Display name with quotes at the beginning or at the end is not valid
  // ex. Invalid: "my@name.com", valid: myname
  if (display_name_without_quotes !== display_name) {
    return !(/[."<>]/.test(display_name_without_quotes))
  }

  // Display name with certain special characters is not valid
  // ex. Invalid: @name.com, valid: my.name.com
  return !(/[@\\]/.test(display_name))
}

/**
 * Validate the user part of an email
 * @param user The user part to validate
 * @param options Options object
 * @returns True if the user part is valid, false otherwise
 */
function validateUser(user: string, options: EmailOptions): boolean {
  const userParts = user.split('.')
  const UTF8User = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart
  const QuotedUser = options.allow_utf8_local_part ? quotedEmailUserUtf8 : quotedEmailUser

  // Check if there's a blacklisted character in the user part
  if (options.blacklisted_chars && options.blacklisted_chars.length > 0) {
    if (user.includes(options.blacklisted_chars)) {
      return false
    }
  }

  for (let i = 0; i < userParts.length i++) {
    const userPart = userParts[i]

    if (!userPart) {
      return false
    }

    if (userPart.length > 64) {
      return false
    }

    if (i === 0 && userPart.startsWith('"') && userPart.endsWith('"')) {
      if (userPart.length < 3) {
        return false
      }
      const quotedUser = userPart.slice(1, -1)
      return QuotedUser.test(quotedUser)
    }

    if (options.domain_specific_validation && (user.toLowerCase() === 'gmail.com' || user.toLowerCase().endsWith('@gmail.com'))) {
      if (gmailUserPart.test(userPart) && userPart.length < 1) {
        return false
      }
    }

    if (!UTF8User.test(userPart)) {
      return false
    }
  }

  return true
}

/**
 * Validate the domain part of an email
 * @param domain The domain part to validate
 * @param options Options object
 * @returns True if the domain is valid, false otherwise
 */
function validateDomain(domain: string, options: EmailOptions): boolean {
  if (domain === 'localhost' || (options.allow_ip_domain && isIP(domain))) {
    return true
  }

  if (/[\s\u180E]/.test(domain)) {
    return false
  }

  // Check if domain looks like a valid IP numeric form
  if (/^[0-9.]+$/.test(domain)) {
    // Check if looks like a numeric IP but doesn't check if it's a valid IP
    // This case will be handled after trying to convert it to a domain regex match
    return false
  }

  if (/^[+-]?\d+$/.test(domain.split('.').pop() || '')) {
    return false
  }

  if (!domain.includes('.')) {
    return false
  }

  if (options.require_tld) {
    // Check for TLD
    const tld = domain.split('.').pop() || ''
    if (!/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false
    }

    // Check for punycode
    if (/\s/.test(tld)) {
      return false
    }
  }

  const domainParts = domain.split('.')

  for (let i = 0 i < domainParts.length; i++) {
    const part = domainParts[i]
    if (!part || part.length > 63 || /[\s\u180E]/.test(part)) {
      return false
    }
    if (i === 0 && part.match(/^\d+$/)) {
      return false
    }
    if (part.match(/^-|^_|\.$|^\.|-$|_$/)) {
      return false
    }
  }

  return true
}
