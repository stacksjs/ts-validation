import assertString from './util/assertString'
import includes from './util/includesArray'

/**
 * List of country codes with
 * corresponding IBAN regular expression
 * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
 */
const ibanRegexThroughCountryCode = {
  AD: /^(AD\d{2})\d{8}[A-Z0-9]{12}$/,
  AE: /^(AE\d{2})\d{19}$/,
  AL: /^(AL\d{2})\d{8}[A-Z0-9]{16}$/,
  AT: /^(AT\d{2})\d{16}$/,
  AZ: /^(AZ\d{2})[A-Z0-9]{4}\d{20}$/,
  BA: /^(BA\d{2})\d{16}$/,
  BE: /^(BE\d{2})\d{12}$/,
  BG: /^(BG\d{2})[A-Z]{4}\d{6}[A-Z0-9]{8}$/,
  BH: /^(BH\d{2})[A-Z]{4}[A-Z0-9]{14}$/,
  BR: /^(BR\d{2})\d{23}[A-Z][A-Z0-9]$/,
  BY: /^(BY\d{2})[A-Z0-9]{4}\d{20}$/,
  CH: /^(CH\d{2})\d{5}[A-Z0-9]{12}$/,
  CR: /^(CR\d{2})\d{18}$/,
  CY: /^(CY\d{2})\d{8}[A-Z0-9]{16}$/,
  CZ: /^(CZ\d{2})\d{20}$/,
  DE: /^(DE\d{2})\d{18}$/,
  DK: /^(DK\d{2})\d{14}$/,
  DO: /^(DO\d{2})[A-Z]{4}\d{20}$/,
  DZ: /^(DZ\d{24})$/,
  EE: /^(EE\d{2})\d{16}$/,
  EG: /^(EG\d{2})\d{25}$/,
  ES: /^(ES\d{2})\d{20}$/,
  FI: /^(FI\d{2})\d{14}$/,
  FO: /^(FO\d{2})\d{14}$/,
  FR: /^(FR\d{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  GB: /^(GB\d{2})[A-Z]{4}\d{14}$/,
  GE: /^(GE\d{2})[A-Z0-9]{2}\d{16}$/,
  GI: /^(GI\d{2})[A-Z]{4}[A-Z0-9]{15}$/,
  GL: /^(GL\d{2})\d{14}$/,
  GR: /^(GR\d{2})\d{7}[A-Z0-9]{16}$/,
  GT: /^(GT\d{2})[A-Z0-9]{24}$/,
  HR: /^(HR\d{2})\d{17}$/,
  HU: /^(HU\d{2})\d{24}$/,
  IE: /^(IE\d{2})[A-Z]{4}\d{14}$/,
  IL: /^(IL\d{2})\d{19}$/,
  IQ: /^(IQ\d{2})[A-Z]{4}\d{15}$/,
  IR: /^(IR\d{2})0\d{2}0\d{18}$/,
  IS: /^(IS\d{2})\d{22}$/,
  IT: /^(IT\d{2})[A-Z]\d{10}[A-Z0-9]{12}$/,
  JO: /^(JO\d{2})[A-Z]{4}\d{22}$/,
  KW: /^(KW\d{2})[A-Z]{4}[A-Z0-9]{22}$/,
  KZ: /^(KZ\d{2})\d{3}[A-Z0-9]{13}$/,
  LB: /^(LB\d{2})\d{4}[A-Z0-9]{20}$/,
  LC: /^(LC\d{2})[A-Z]{4}[A-Z0-9]{24}$/,
  LI: /^(LI\d{2})\d{5}[A-Z0-9]{12}$/,
  LT: /^(LT\d{2})\d{16}$/,
  LU: /^(LU\d{2})\d{3}[A-Z0-9]{13}$/,
  LV: /^(LV\d{2})[A-Z]{4}[A-Z0-9]{13}$/,
  MA: /^(MA\d{26})$/,
  MC: /^(MC\d{2})\d{10}[A-Z0-9]{11}\d{2}$/,
  MD: /^(MD\d{2})[A-Z0-9]{20}$/,
  ME: /^(ME\d{2})\d{18}$/,
  MK: /^(MK\d{2})\d{3}[A-Z0-9]{10}\d{2}$/,
  MR: /^(MR\d{2})\d{23}$/,
  MT: /^(MT\d{2})[A-Z]{4}\d{5}[A-Z0-9]{18}$/,
  MU: /^(MU\d{2})[A-Z]{4}\d{19}[A-Z]{3}$/,
  MZ: /^(MZ\d{2})\d{21}$/,
  NL: /^(NL\d{2})[A-Z]{4}\d{10}$/,
  NO: /^(NO\d{2})\d{11}$/,
  PK: /^(PK\d{2})[A-Z0-9]{4}\d{16}$/,
  PL: /^(PL\d{2})\d{24}$/,
  PS: /^(PS\d{2})[A-Z]{4}[A-Z0-9]{21}$/,
  PT: /^(PT\d{2})\d{21}$/,
  QA: /^(QA\d{2})[A-Z]{4}[A-Z0-9]{21}$/,
  RO: /^(RO\d{2})[A-Z]{4}[A-Z0-9]{16}$/,
  RS: /^(RS\d{2})\d{18}$/,
  SA: /^(SA\d{2})\d{2}[A-Z0-9]{18}$/,
  SC: /^(SC\d{2})[A-Z]{4}\d{20}[A-Z]{3}$/,
  SE: /^(SE\d{2})\d{20}$/,
  SI: /^(SI\d{2})\d{15}$/,
  SK: /^(SK\d{2})\d{20}$/,
  SM: /^(SM\d{2})[A-Z]\d{10}[A-Z0-9]{12}$/,
  SV: /^(SV\d{2})[A-Z0-9]{4}\d{20}$/,
  TL: /^(TL\d{2})\d{19}$/,
  TN: /^(TN\d{2})\d{20}$/,
  TR: /^(TR\d{2})\d{5}[A-Z0-9]{17}$/,
  UA: /^(UA\d{2})\d{6}[A-Z0-9]{19}$/,
  VA: /^(VA\d{2})\d{18}$/,
  VG: /^(VG\d{2})[A-Z]{4}\d{16}$/,
  XK: /^(XK\d{2})\d{16}$/,
}

/**
 * Check if the country codes passed are valid using the
 * ibanRegexThroughCountryCode as a reference
 *
 * @param {Array} countryCodeArray
 * @return {boolean}
 */

function hasOnlyValidCountryCodes(countryCodeArray: string[]): boolean {
  const countryCodeArrayFilteredWithObjectIbanCode = countryCodeArray
    .filter(countryCode => !(countryCode in ibanRegexThroughCountryCode))

  if (countryCodeArrayFilteredWithObjectIbanCode.length > 0) {
    return false
  }

  return true
}

/**
 * Check whether string has correct universal IBAN format
 * The IBAN consists of up to 34 alphanumeric characters, as follows:
 * Country Code using ISO 3166-1 alpha-2, two letters
 * check digits, two digits and
 * Basic Bank Account Number (BBAN), up to 30 alphanumeric characters.
 * NOTE: Permitted IBAN characters are: digits [0-9] and the 26 latin alphabetic [A-Z]
 *
 * @param {string} str - string under validation
 * @param {object} options - object to pass the countries to be either whitelisted or blacklisted
 * @return {boolean}
 */
function hasValidIbanFormat(str: string, options: { whitelist?: string[], blacklist?: string[] } = {}): boolean {
  // Strip white spaces and hyphens
  const strippedStr = str.replace(/[\s\-]+/g, '').toUpperCase()
  const isoCountryCode = strippedStr.slice(0, 2).toUpperCase()

  const isoCountryCodeInIbanRegexCodeObject = isoCountryCode in ibanRegexThroughCountryCode

  if (options.whitelist) {
    if (!hasOnlyValidCountryCodes(options.whitelist)) {
      return false
    }

    const isoCountryCodeInWhiteList = includes(options.whitelist, isoCountryCode)

    if (!isoCountryCodeInWhiteList) {
      return false
    }
  }

  if (options.blacklist) {
    const isoCountryCodeInBlackList = includes(options.blacklist, isoCountryCode)

    if (isoCountryCodeInBlackList) {
      return false
    }
  }

  return (isoCountryCodeInIbanRegexCodeObject)
    && ibanRegexThroughCountryCode[isoCountryCode].test(strippedStr)
}

/**
 * Check whether string has valid IBAN Checksum
 * by performing basic mod-97 operation and
 * the remainder should equal 1
 * -- Start by rearranging the IBAN by moving the four initial characters to the end of the string
 * -- Replace each letter in the string with two digits, A -> 10, B = 11, Z = 35
 * -- Interpret the string as a decimal integer and
 * -- compute the remainder on division by 97 (mod 97)
 * Reference: https://en.wikipedia.org/wiki/International_Bank_Account_Number
 *
 * @param {string} str
 * @return {boolean}
 */
function hasValidIbanChecksum(str: string): boolean {
  const strippedStr = str.replace(/[^A-Z0-9]+/gi, '').toUpperCase() // Keep only digits and A-Z latin alphabetic
  const rearranged = strippedStr.slice(4) + strippedStr.slice(0, 4)
  const alphaCapsReplacedWithDigits = rearranged.replace(/[A-Z]/g, char => String(char.charCodeAt(0) - 55))

  const remainder = alphaCapsReplacedWithDigits.match(/\d{1,7}/g)
    ?.reduce((acc, value) => (Number(acc) + Number(value)) % 97, 0)

  return remainder === 1
}

export default function isIBAN(str: string, options: { whitelist?: string[], blacklist?: string[] } = {}): boolean {
  assertString(str)

  return hasValidIbanFormat(str, options) && hasValidIbanChecksum(str)
}

export const locales = Object.keys(ibanRegexThroughCountryCode)
