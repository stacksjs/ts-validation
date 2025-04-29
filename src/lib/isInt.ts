import type { IsIntOptions } from '../types'
import assertString from './util/assertString'
import isNullOrUndefined from './util/nullUndefinedCheck'

const int = /^[-+]?(?:0|[1-9]\d*)$/
const intLeadingZeroes = /^[-+]?\d+$/

/**
 * Check if the string is Int
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isInt(str: string, options: IsIntOptions): boolean {
  assertString(str)
  options = options || {}

  // Get the regex to use for testing, based on whether
  // leading zeroes are allowed or not.
  const regex = options.allow_leading_zeroes === false ? int : intLeadingZeroes

  // Check min/max/lt/gt
  const num = Number.parseInt(str, 10)
  const minCheckPassed = (!Object.prototype.hasOwnProperty.call(options, 'min') || isNullOrUndefined(options.min) || num >= (options.min ?? 0))
  const maxCheckPassed = (!Object.prototype.hasOwnProperty.call(options, 'max') || isNullOrUndefined(options.max) || num <= (options.max ?? 0))
  const ltCheckPassed = (!Object.prototype.hasOwnProperty.call(options, 'lt') || isNullOrUndefined(options.lt) || num < (options.lt ?? 0))
  const gtCheckPassed = (!Object.prototype.hasOwnProperty.call(options, 'gt') || isNullOrUndefined(options.gt) || num > (options.gt ?? 0))

  return regex.test(str) && minCheckPassed && maxCheckPassed && ltCheckPassed && gtCheckPassed
}
