import assertString from './util/assertString'
import toString from './util/toString'

export interface IsInOptions {
  hasOwnProperty?: boolean | string
  indexOf?: boolean | string
  includes?: boolean | string
}


/**
 * Check if the string is In
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isIn(str, options): boolean {
  assertString(str)
  let i
  if (Object.prototype.toString.call(options) === '[object Array]') {
    const array = []
    for (i in options) {
      // https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md#ignoring-code-for-coverage-purposes
      // istanbul ignore else
      if ({}.hasOwnProperty.call(options, i)) {
        array[i] = toString(options[i])
      }
    }
    return array.includes(str)
  }
  else if (typeof options === 'object') {
    return options.hasOwnProperty(str)
  }
  else if (options && typeof options.indexOf === 'function') {
    return options.includes(str)
  }
  return false
}
