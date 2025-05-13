import blacklist from './blacklist'
import contains from './contains'
// String manipulation
import equals from './equals'
import escape from './escape'

// Date related
import isAfter from './isAfter'
// String type validators
import isAlpha, { locales as isAlphaLocales } from './isAlpha'
import isAlphanumeric, { locales as isAlphanumericLocales } from './isAlphanumeric'
import isAscii from './isAscii'
import isBase32 from './isBase32'
import isBase58 from './isBase58'
import isBase64 from './isBase64'
import isBefore from './isBefore'
import isBIC from './isBIC'
import isBoolean from './isBoolean'
import isBtcAddress from './isBtcAddress'
import isByteLength from './isByteLength'
// Financial validators
import isCreditCard from './isCreditCard'

import isCurrency from './isCurrency'
import isDataURI from './isDataURI'
// Date and time validators
import isDate from './isDate'
import isDecimal from './isDecimal'
import isDivisibleBy from './isDivisibleBy'
import isEAN from './isEAN'
// Email/URL/IP validators
import isEmail from './isEmail'
import isEmpty from './isEmpty'
import isEthereumAddress from './isEthereumAddress'

import isFloat, { locales as isFloatLocales } from './isFloat'
import isFQDN from './isFQDN'
import isFullWidth from './isFullWidth'
import isHalfWidth from './isHalfWidth'

import isHash from './isHash'
import isHexadecimal from './isHexadecimal'
// Colors
import isHexColor from './isHexColor'
import isHSL from './isHSL'
import isIBAN, { locales as ibanLocales } from './isIBAN'
import isIdentityCard from './isIdentityCard'
// Identification
import isIMEI from './isIMEI'
// Array/list validators
import isIn from './isIn'
// Number validators
import isInt from './isInt'
import isIP from './isIP'
import isIPRange from './isIPRange'
import isISBN from './isISBN'
import isISIN from './isISIN'
import isISO4217 from './isISO4217'
// ISO standards
import { isFreightContainerID, isISO6346 } from './isISO6346'
import isISO6391 from './isISO6391'
import isISO8601 from './isISO8601'
import isISO15924 from './isISO15924'
import isISO31661Alpha2 from './isISO31661Alpha2'
import isISO31661Alpha3 from './isISO31661Alpha3'

import isISO31661Numeric from './isISO31661Numeric'
// Identifiers
import isISRC from './isISRC'
import isISSN from './isISSN'
import isJSON from './isJSON'
import isJWT from './isJWT'
// Geographical validators
import isLatLong from './isLatLong'
import isLength from './isLength'

import isLicensePlate from './isLicensePlate'
import isLocale from './isLocale'
import isLowercase from './isLowercase'
import isLuhnNumber from './isLuhnNumber'
import isMACAddress from './isMACAddress'
import isMagnetURI from './isMagnetURI'

import isMailtoURI from './isMailtoURI'
import isMD5 from './isMD5'
// Phone validators
import isMobilePhone, { locales as isMobilePhoneLocales } from './isMobilePhone'

import isMongoId from './isMongoId'
import isMultibyte from './isMultibyte'
import isNumeric from './isNumeric'
import isOctal from './isOctal'
import isPassportNumber, { locales as passportNumberLocales } from './isPassportNumber'
import isPort from './isPort'
import isPostalCode, { locales as isPostalCodeLocales } from './isPostalCode'
import isRFC3339 from './isRFC3339'
import isRgbColor from './isRgbColor'
import isSemVer from './isSemVer'
import isSlug from './isSlug'

// Security
import isStrongPassword from './isStrongPassword'
import isSurrogatePair from './isSurrogatePair'

import isTaxID from './isTaxID'

import isTime from './isTime'
import isULID from './isULID'
import isUppercase from './isUppercase'
import isURL from './isURL'
import isUUID from './isUUID'
import isVariableWidth from './isVariableWidth'
import isVAT from './isVAT'
import isWhitelisted from './isWhitelisted'

import ltrim from './ltrim'
import matches from './matches'

import normalizeEmail from './normalizeEmail'
import rtrim from './rtrim'

import stripLow from './stripLow'
import toBoolean from './toBoolean'
// Conversion functions
import toDate from './toDate'
import toFloat from './toFloat'
import toInt from './toInt'
import trim from './trim'
import unescape from './unescape'

// Utility function
import toString from './util/toString'

import whitelist from './whitelist'

// Package version
const version = '1.0.0' // will be automatically updated with releases

// Main validator object
const validator: { [key: string]: any } = {
  version,

  // Conversion methods
  toDate,
  toFloat,
  toInt,
  toBoolean,

  // String manipulation
  equals,
  contains,
  matches,
  trim,
  ltrim,
  rtrim,
  escape,
  unescape,
  stripLow,
  whitelist,
  blacklist,
  isWhitelisted,
  normalizeEmail,

  // Email/URL/IP
  isEmail,
  isURL,
  isMACAddress,
  isIP,
  isIPRange,
  isFQDN,
  isMailtoURI,
  isMagnetURI,
  isDataURI,

  // Date and time
  isDate,
  isTime,
  isRFC3339,
  isISO8601,

  // String types
  isAlpha,
  isAlphaLocales,
  isAlphanumeric,
  isAlphanumericLocales,
  isNumeric,
  isPassportNumber,
  passportNumberLocales,
  isPort,
  isLowercase,
  isUppercase,
  isAscii,
  isFullWidth,
  isHalfWidth,
  isVariableWidth,
  isMultibyte,
  isBoolean,
  isLocale,
  isSlug,
  isEmpty,
  isLength,
  isByteLength,
  isSemVer,
  isSurrogatePair,

  // Numbers
  isInt,
  isFloat,
  isFloatLocales,
  isDecimal,
  isHexadecimal,
  isOctal,
  isDivisibleBy,
  isLuhnNumber,

  // Financial
  isCreditCard,
  isBIC,
  isIBAN,
  ibanLocales,
  isEthereumAddress,
  isCurrency,
  isBtcAddress,

  // Colors
  isHexColor,
  isRgbColor,
  isHSL,

  // Identifiers
  isISRC,
  isMD5,
  isHash,
  isJWT,
  isJSON,
  isUUID,
  isULID,
  isMongoId,
  isBase32,
  isBase58,
  isBase64,

  // Date related
  isAfter,
  isBefore,

  // Array/list
  isIn,

  // Identification
  isIMEI,
  isEAN,
  isISIN,
  isISBN,
  isISSN,
  isTaxID,
  isIdentityCard,
  isVAT,

  // Phone
  isMobilePhone,
  isMobilePhoneLocales,
  isPostalCode,
  isPostalCodeLocales,

  // Geographical
  isLatLong,
  isLicensePlate,

  // ISO standards
  isISO6346,
  isFreightContainerID,
  isISO6391,
  isISO15924,
  isISO31661Alpha2,
  isISO31661Alpha3,
  isISO31661Numeric,
  isISO4217,

  // Security
  isStrongPassword,

  // Utility
  toString,
}

export default validator
