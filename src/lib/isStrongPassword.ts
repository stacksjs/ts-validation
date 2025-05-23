import type { PasswordAnalysis } from '../types'
import assertString from './util/assertString'
import merge from './util/merge'

const upperCaseRegex = /^[A-Z]$/
const lowerCaseRegex = /^[a-z]$/
const numberRegex = /^\d$/
const symbolRegex = /^[-#!$@£%^&*()_+|~=`{}[\]:"'<>?,./\\ ]$/

const defaultOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
}

/* Counts number of occurrences of each char in a string
 * could be moved to util/ ?
*/
function countChars(str: string) {
  const result: { [key: string]: number } = {}
  Array.from(str).forEach((char) => {
    const curVal = result[char]
    if (curVal) {
      result[char] += 1
    }
    else {
      result[char] = 1
    }
  })
  return result
}

/* Return information about a password */
function analyzePassword(password: string) {
  const charMap = countChars(password)
  const analysis = {
    length: password.length,
    uniqueChars: Object.keys(charMap).length,
    uppercaseCount: 0,
    lowercaseCount: 0,
    numberCount: 0,
    symbolCount: 0,
  }
  Object.keys(charMap).forEach((char) => {
    /* istanbul ignore else */
    if (upperCaseRegex.test(char)) {
      analysis.uppercaseCount += charMap[char]
    }
    else if (lowerCaseRegex.test(char)) {
      analysis.lowercaseCount += charMap[char]
    }
    else if (numberRegex.test(char)) {
      analysis.numberCount += charMap[char]
    }
    else if (symbolRegex.test(char)) {
      analysis.symbolCount += charMap[char]
    }
  })
  return analysis
}

function scorePassword(analysis: PasswordAnalysis, scoringOptions: typeof defaultOptions) {
  let points = 0
  points += analysis.uniqueChars * scoringOptions.pointsPerUnique
  points += (analysis.length - analysis.uniqueChars) * scoringOptions.pointsPerRepeat
  if (analysis.lowercaseCount > 0) {
    points += scoringOptions.pointsForContainingLower
  }
  if (analysis.uppercaseCount > 0) {
    points += scoringOptions.pointsForContainingUpper
  }
  if (analysis.numberCount > 0) {
    points += scoringOptions.pointsForContainingNumber
  }
  if (analysis.symbolCount > 0) {
    points += scoringOptions.pointsForContainingSymbol
  }
  return points
}

/**
 * Check if the string is StrongPassword
 *
 * @param str - The string to check
 * @param options = null - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isStrongPassword(str: string, options: typeof defaultOptions = defaultOptions): boolean | number {
  assertString(str)
  const analysis = analyzePassword(str)
  options = merge(options || {}, defaultOptions)
  if (options.returnScore) {
    return scorePassword(analysis, options)
  }
  return analysis.length >= options.minLength
    && analysis.lowercaseCount >= options.minLowercase
    && analysis.uppercaseCount >= options.minUppercase
    && analysis.numberCount >= options.minNumbers
    && analysis.symbolCount >= options.minSymbols
}
