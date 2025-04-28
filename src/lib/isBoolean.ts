import assertString from './util/assertString'
import includes from './util/includesArray'

export interface IsBooleanOptions {
  loose?: boolean
}

const defaultOptions: IsBooleanOptions = { loose: false }
const strictBooleans = ['true', 'false', '1', '0']
const looseBooleans = [...strictBooleans, 'yes', 'no']

/**
 * Check if a string represents a boolean value
 *
 * @param str - The string to check
 * @param options - Options object that determines matching behavior
 * @returns True if the string represents a boolean value, false otherwise
 */
export default function isBoolean(str: string, options: IsBooleanOptions = defaultOptions): boolean {
  assertString(str)

  if (options.loose) {
    return includes(looseBooleans, str.toLowerCase())
  }

  return includes(strictBooleans, str)
}
