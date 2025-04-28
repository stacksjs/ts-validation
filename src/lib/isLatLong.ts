import assertString from './util/assertString'
import includes from './util/includesString'
import merge from './util/merge'

export interface IsLatLongOptions {
  checkDMS?: boolean | string
}


const lat = /^\(?[+-]?(90(\.0+)?|[1-8]?\d(\.\d+)?)$/
const long = /^\s?[+-]?(180(\.0+)?|1[0-7]\d(\.\d+)?|\d{1,2}(\.\d+)?)\)?$/

const latDMS = /^(([1-8]?\d)\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|90\D+0\D+0)\D+$/
const longDMS = /^\s*([1-7]?\d{1,2}\D+([1-5]?\d|60)\D+([1-5]?\d|60)(\.\d+)?|180\D+0\D+0)\D+$/

const defaultLatLongOptions = {
  checkDMS: false
}

/**
 * Check if the string is LatLong
 *
 * @param str - The string to check
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isLatLong(str: string, options: IsLatLongOptions: any) {
  assertString(str)
  options = merge(options, defaultLatLongOptions)

  if (!includes(str, ','))
    return false
  const pair = str.split(',')
  if ((pair[0].startsWith('(') && !pair[1].endsWith(')'))
    || (pair[1].endsWith(')') && !pair[0].startsWith('('))) {
    return false
  }

  if (options.checkDMS) {
    return latDMS.test(pair[0]) && longDMS.test(pair[1])
  }
  return lat.test(pair[0]) && long.test(pair[1])
}
