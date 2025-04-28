import assertString from './util/assertString'

// http://www.brainjar.com/js/validation/
// https://www.aba.com/news-research/research-analysis/routing-number-policy-procedures
// series reserved for future use are excluded
const isRoutingReg = /^(?!1[3-9]|20|3[3-9]|4\d|5\d|60|7[3-9]|8[1-9]|9[0-2]|9[3-9])\d{9}$/

/**
 * Check if the string is AbaRouting
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isAbaRouting(str: string): boolean {
  assertString(str)

  if (!isRoutingReg.test(str))
    return false

  let checkSumVal = 0
  for (let i = 0; i < str.length; i++) {
    if (i % 3 === 0)
      checkSumVal += Number.parseInt(str[i]) * 3
    else if (i % 3 === 1)
      checkSumVal += Number.parseInt(str[i]) * 7
    else checkSumVal += Number.parseInt(str[i]) * 1
  }
  return (checkSumVal % 10 === 0)
}
