/* eslint-disable prefer-rest-params */
import type { IsRgbColorOptions } from '../types'
import assertString from './util/assertString'

const rgbColor = /^rgb\((?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5],){2}(?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\)$/
const rgbaColor = /^rgba\((?:\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5],){3}(?:0?\.\d\d?|1(?:\.0)?|0(?:\.0)?)\)$/
const rgbColorPercent = /^rgb\((?:\d%|[1-9]\d%|100%,){2}(?:\d%|[1-9]\d%|100%)\)$/
const rgbaColorPercent = /^rgba\((?:\d%|[1-9]\d%|100%,){3}(?:0?\.\d\d?|1(?:\.0)?|0(?:\.0)?)\)$/
const startsWithRgb = /^rgba?/

/**
 * Check if the string is RgbColor
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isRgbColor(str: string, options: IsRgbColorOptions): boolean {
  assertString(str)
  // default options to true for percent and false for spaces
  let allowSpaces = false
  let includePercentValues = true
  if (typeof options !== 'object') {
    if (arguments.length >= 2) {
      includePercentValues = arguments[1]
    }
  }
  else {
    allowSpaces = options.allowSpaces !== undefined ? options.allowSpaces : allowSpaces
    includePercentValues = options.includePercentValues !== undefined
      ? options.includePercentValues
      : includePercentValues
  }

  if (allowSpaces) {
    // make sure it starts with continous rgba? without spaces before stripping
    if (!startsWithRgb.test(str)) {
      return false
    }
    // strip all whitespace
    str = str.replace(/\s/g, '')
  }

  if (!includePercentValues) {
    return rgbColor.test(str) || rgbaColor.test(str)
  }

  return rgbColor.test(str)
    || rgbaColor.test(str)
    || rgbColorPercent.test(str)
    || rgbaColorPercent.test(str)
}
