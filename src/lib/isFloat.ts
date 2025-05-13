import type { IsFloatOptions } from '../types'
import { decimal } from './alpha'
import assertString from './util/assertString'
import isNullOrUndefined from './util/nullUndefinedCheck'

/**
 * Check if the string is Float
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isFloat(str: string, options: IsFloatOptions): boolean {
  assertString(str)
  options = options || {}
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${typeof options.locale === 'string' ? decimal[options.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`)
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false
  }
  const value = Number.parseFloat(str.replace(',', '.'))
  return float.test(str)
    && (!('min' in options) || isNullOrUndefined(options.min) || value >= (options.min as unknown as number))
    && (!('max' in options) || isNullOrUndefined(options.max) || value <= (options.max as unknown as number))
    && (!('lt' in options) || isNullOrUndefined(options.lt) || value < (options.lt as unknown as number))
    && (!('gt' in options) || isNullOrUndefined(options.gt) || value > (options.gt as unknown as number))
}

export const locales: string[] = Object.keys(decimal)
