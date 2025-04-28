import { decimal } from './alpha'
import assertString from './util/assertString'
import isNullOrUndefined from './util/nullUndefinedCheck'

export interface IsFloatOptions {
  locale?: boolean | string
  hasOwnProperty?: boolean | string
  min?: number
  max?: number
  lt?: boolean | string
  gt?: boolean | string
}


/**
 * Check if the string is Float
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isFloat(str, options): boolean {
  assertString(str)
  options = options || {}
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${options.locale ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`)
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false
  }
  const value = Number.parseFloat(str.replace(',', '.'))
  return float.test(str)
    && (!options.hasOwnProperty('min') || isNullOrUndefined(options.min) || value >= options.min)
    && (!options.hasOwnProperty('max') || isNullOrUndefined(options.max) || value <= options.max)
    && (!options.hasOwnProperty('lt') || isNullOrUndefined(options.lt) || value < options.lt)
    && (!options.hasOwnProperty('gt') || isNullOrUndefined(options.gt) || value > options.gt)
}

export const locales = Object.keys(decimal)
