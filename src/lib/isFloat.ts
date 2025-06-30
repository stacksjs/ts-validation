import type { FloatOptions } from '../types'
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
export default function isFloat(str: string, options?: FloatOptions): boolean {
  assertString(str)
  const opts = options || {}
  const float = new RegExp(`^(?:[-+])?(?:[0-9]+)?(?:\\${typeof opts.locale === 'string' ? decimal[opts.locale] : '.'}[0-9]*)?(?:[eE][\\+\\-]?(?:[0-9]+))?$`)
  if (str === '' || str === '.' || str === ',' || str === '-' || str === '+') {
    return false
  }
  const value = Number.parseFloat(str.replace(',', '.'))
  return float.test(str)
    && (!('min' in opts) || isNullOrUndefined(opts.min) || value >= (opts.min as number))
    && (!('max' in opts) || isNullOrUndefined(opts.max) || value <= (opts.max as number))
    && (!('lt' in opts) || isNullOrUndefined(opts.lt) || value < (opts.lt as number))
    && (!('gt' in opts) || isNullOrUndefined(opts.gt) || value > (opts.gt as number))
}

export const locales: string[] = Object.keys(decimal)
