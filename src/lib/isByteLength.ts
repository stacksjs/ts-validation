import type { IsByteLengthOptions } from '../types'
import assertString from './util/assertString'

/* eslint-disable prefer-rest-params */
/**
 * Check if the string is ByteLength
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isByteLength(str: string, options: IsByteLengthOptions): boolean {
  assertString(str)
  let min
  let max
  if (typeof (options) === 'object') {
    min = options.min || 0
    max = options.max
  }
  else { // backwards compatibility: isByteLength(str, min [, max])
    min = arguments[1]
    max = arguments[2]
  }
  const len = encodeURI(str).split(/%..|./).length - 1
  return len >= min && (typeof max === 'undefined' || len <= max)
}
