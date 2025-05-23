import isBase64 from './isBase64'
import assertString from './util/assertString'

/**
 * Check if the string is JWT
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isJWT(str: string): boolean {
  assertString(str)

  const dotSplit = str.split('.')
  const len = dotSplit.length

  if (len !== 3) {
    return false
  }

  return dotSplit.reduce((acc, currElem) => acc && isBase64(currElem, { urlSafe: true }), true)
}
