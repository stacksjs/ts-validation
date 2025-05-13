import assertString from './util/assertString'

const issn = '^\\d{4}-?\\d{3}[\\dX]$'

/**
 * Check if the string is ISSN
 *
 * @param str - The string to check
 * @param options - Options object
 * @param options.require_hyphen - Whether to require hyphen in ISSN
 * @param options.case_sensitive - Whether to check case sensitivity
 * @returns True if the string matches the validation, false otherwise
 */
export default function isISSN(str: string, options: { require_hyphen?: boolean, case_sensitive?: boolean } = {}): boolean {
  assertString(str)
  let testIssn = issn
  testIssn = options.require_hyphen ? testIssn.replace('?', '') : testIssn
  const regex = options.case_sensitive ? new RegExp(testIssn) : new RegExp(testIssn, 'i')
  if (!regex.test(str)) {
    return false
  }
  const digits = str.replace('-', '').toUpperCase()
  let checksum = 0
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i]
    checksum += (digit === 'X' ? 10 : +digit) * (8 - i)
  }
  return checksum % 11 === 0
}
