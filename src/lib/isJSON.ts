import assertString from './util/assertString'
import includes from './util/includesArray'
import merge from './util/merge'

export interface IsJSONOptions {
  allow_primitives?: boolean | string
}

const default_json_options = {
  allow_primitives: false,
}

/**
 * Check if the string is JSON
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isJSON(str: string, options: IsJSONOptions = {}): boolean {
  assertString(str)
  try {
    options = merge(options, default_json_options)
    let primitives: (null | boolean)[] = []
    if (options.allow_primitives) {
      primitives = [null, false, true]
    }

    const obj = JSON.parse(str)
    return includes(primitives, obj) || (!!obj && typeof obj === 'object')
  }
  catch (e) { /* ignore */ }
  return false
}
