import assertString from './util/assertString'
import merge from './util/merge'

export interface IsBase64Options {
  urlSafe?: boolean | string
  padding?: boolean | string
}


const base64WithPadding = /^(?:[A-Z0-9+/]{4})*(?:[A-Z0-9+/]{2}==|[A-Z0-9+/]{3}=|[A-Z0-9+/]{4})$/i
const base64WithoutPadding = /^[A-Z0-9+/]+$/i
const base64UrlWithPadding = /^(?:[\w-]{4})*(?:[\w-]{2}==|[\w-]{3}=|[\w-]{4})$/
const base64UrlWithoutPadding = /^[\w-]+$/

/**
 * Check if the string is Base64
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBase64(str, options): boolean {
  assertString(str)
  options = merge(options, { urlSafe: false, padding: !options?.urlSafe })

  if (str === '')
    return true

  let regex
  if (options.urlSafe) {
    regex = options.padding ? base64UrlWithPadding : base64UrlWithoutPadding
  }
  else {
    regex = options.padding ? base64WithPadding : base64WithoutPadding
  }

  return (!options.padding || str.length % 4 === 0) && regex.test(str)
}
