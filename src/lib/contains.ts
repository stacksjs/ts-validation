import assertString from './util/assertString'
import merge from './util/merge'
import toString from './util/toString'

const defaultContainsOptions = {
  ignoreCase: false,
  minOccurrences: 1,
}

interface ContainsOptions {
  ignoreCase: boolean
  minOccurrences: number
}

/**
 * contains
 *
 * @param str - The string to check
 * @param elem - Options object
 * @param options - Options object
 * @returns The processed string
 */
export default function contains(str: string, elem: string, options: ContainsOptions): boolean {
  assertString(str)
  options = merge(options, defaultContainsOptions)

  if (options.ignoreCase) {
    return str.toLowerCase().split(toString(elem).toLowerCase()).length > options.minOccurrences
  }

  return str.split(toString(elem)).length > options.minOccurrences
}
