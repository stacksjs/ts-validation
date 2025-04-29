import assertString from './util/assertString'

/**
 * matches
 *
 * @param str - The string to check
 * @param pattern - Options object
 * @param modifiers - Options object
 * @returns The processed string
 */
export default function matches(str: string, pattern: string | RegExp, modifiers: string): boolean {
  assertString(str)
  if (Object.prototype.toString.call(pattern) !== '[object RegExp]') {
    pattern = new RegExp(pattern, modifiers)
  }
  return !!str.match(pattern)
}
