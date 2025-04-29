import type { IsTimeOptions } from '../types'
import merge from './util/merge'

const default_time_options: IsTimeOptions = {
  hourFormat: 'hour24',
  mode: 'default',
}

const formats = {
  hour24: {
    default: /^([01]?\d|2[0-3]):([0-5]\d)$/,
    withSeconds: /^([01]?\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
    withOptionalSeconds: /^([01]?\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/,
  },
  hour12: {
    default: /^(0?[1-9]|1[0-2]):([0-5]\d) (A|P)M$/,
    withSeconds: /^(0?[1-9]|1[0-2]):([0-5]\d):([0-5]\d) (A|P)M$/,
    withOptionalSeconds: /^(0?[1-9]|1[0-2]):([0-5]\d)(?::([0-5]\d))? (A|P)M$/,
  },
}

/**
 * Check if the string is Time
 *
 * @param input - Options object
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isTime(input: string, options: IsTimeOptions = default_time_options): boolean {
  options = merge(options, default_time_options)
  if (typeof input !== 'string')
    return false
  return formats[options.hourFormat][options.mode].test(input)
}
