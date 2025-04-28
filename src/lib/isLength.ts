import assertString from './util/assertString'

export interface IsLengthOptions {
  min?: number
  max?: number
  discreteLengths?: boolean | string
}


/* eslint-disable prefer-rest-params */
/**
 * Check if the string is Length
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isLength(str: string, options: IsLengthOptions: any) {
  assertString(str)
  let min
  let max

  if (typeof (options) === 'object') {
    min = options.min || 0
    max = options.max
  }
  else { // backwards compatibility: isLength(str, min [, max])
    min = arguments[1] || 0
    max = arguments[2]
  }

  const presentationSequences = str.match(/(\uFE0F|\uFE0E)/g) || []
  const surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || []
  const len = str.length - presentationSequences.length - surrogatePairs.length
  const isInsideRange = len >= min && (typeof max === 'undefined' || len <= max)

  if (isInsideRange && Array.isArray(options?.discreteLengths)) {
    return options.discreteLengths.includes(len)
  }

  return isInsideRange
}
