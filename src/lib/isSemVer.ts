import assertString from './util/assertString'
import multilineRegexp from './util/multilineRegex'

/**
 * Regular Expression to match
 * semantic versioning (SemVer)
 * built from multi-line, multi-parts regexp
 * Reference: https://semver.org/
 */
const semanticVersioningRegex = multilineRegexp([
  '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)',
  '(?:-((?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-z-][0-9a-z-]*))*))',
  '?(?:\\+([0-9a-z-]+(?:\\.[0-9a-z-]+)*))?$',
], 'i')

/**
 * Check if a string is a valid semantic version (SemVer).
 *
 * @param str - The string to check
 * @returns True if the string is a valid semantic version, false otherwise
 */
export default function isSemVer(str: string): boolean {
  assertString(str)

  return semanticVersioningRegex.test(str)
}
