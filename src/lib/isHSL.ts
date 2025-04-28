import assertString from './util/assertString'

const hslComma = /^hsla?\(((\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?))(deg|grad|rad|turn)?(,(\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?)%){2}(,((\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?)%?))?\)$/i
const hslSpace = /^hsla?\(((\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?))(deg|grad|rad|turn)?(\s(\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?)%){2}\s?(\/\s((\+|-)?(\d+(\.\d+)?(e(\+|-)?\d+)?|\.\d+(e(\+|-)?\d+)?)%?)\s?)?\)$/i

/**
 * Check if the string is HSL
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isHSL(str): boolean {
  assertString(str)

  // Strip duplicate spaces before calling the validation regex (See  #1598 for more info)
  const strippedStr = str.replace(/\s+/g, ' ').replace(/\s?(hsla?\(|\)|,)\s?/gi, '$1')

  if (strippedStr.includes(',')) {
    return hslComma.test(strippedStr)
  }

  return hslSpace.test(strippedStr)
}
