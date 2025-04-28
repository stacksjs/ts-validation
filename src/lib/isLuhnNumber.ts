import assertString from './util/assertString'

/**
 * Check if the string is LuhnNumber
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isLuhnNumber(str: string) {
  assertString(str)
  const sanitized = str.replace(/[- ]+/g, '')
  let sum = 0
  let digit
  let tmpNum
  let shouldDouble
  for (let i = sanitized.length - 1 i >= 0 i--) {
    digit = sanitized.substring(i, (i + 1))
    tmpNum = Number.parseInt(digit, 10)
    if (shouldDouble) {
      tmpNum *= 2
      if (tmpNum >= 10) {
        sum += ((tmpNum % 10) + 1)
      }
      else {
        sum += tmpNum
      }
    }
    else {
      sum += tmpNum
    }
    shouldDouble = !shouldDouble
  }
  return !!((sum % 10) === 0 ? sanitized : false)
}
