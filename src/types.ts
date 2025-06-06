import type { alphanumeric } from './lib/isAlphanumeric'
import type { ArrayValidator } from './validators/arrays'
import type { BooleanValidator } from './validators/booleans'
import type { CustomValidator } from './validators/custom'
import type { DateValidator } from './validators/dates'
import type { DatetimeValidator } from './validators/datetimes'
import type { EnumValidator } from './validators/enums'
import type { NumberValidator } from './validators/numbers'
import type { ObjectValidator } from './validators/objects'
import type { PasswordValidator } from './validators/password'
import type { StringValidator } from './validators/strings'
import type { TimestampValidator } from './validators/timestamps'
import type { UnixValidator } from './validators/unix'

export interface ValidationError {
  message: string
}

export interface ValidationErrorMap {
  [field: string]: ValidationError[]
}

export type ValidationErrors = ValidationError[] | ValidationErrorMap

export interface ValidationResult {
  valid: boolean
  errors: ValidationErrors
}

export interface ValidationRule<T> {
  name: string
  test: (value: T) => boolean
  message: string
  params?: Record<string, any>
}

export interface ContainsOptions {
  ignoreCase: boolean
  minOccurrences: number
}

export interface AlphanumericOptions {
  ignore?: string | RegExp
  locale?: LocaleInstance
}

export type LocaleInstance = keyof typeof alphanumeric

export interface IsBase32Options {
  crockford?: boolean | string
}

export interface IsBase64Options {
  urlSafe?: boolean | string
  padding?: boolean | string
}

export interface IsBeforeOptions {
  comparisonDate?: string | number | Date
}

export interface IsBooleanOptions {
  loose?: boolean
}

export interface IsByteLengthOptions {
  min?: number
  max?: number
}

export interface CreditCardOptions {
  provider?: string
}

export interface CurrencyOptions {
  symbol: string
  require_symbol: boolean
  allow_space_after_symbol: boolean
  symbol_after_digits: boolean
  allow_negatives: boolean
  parens_for_negatives: boolean
  negative_sign_before_digits: boolean
  negative_sign_after_digits: boolean
  allow_negative_sign_placeholder: boolean
  thousands_separator: string
  decimal_separator: string
  allow_decimal: boolean
  require_decimal: boolean
  digits_after_decimal: number[]
  allow_space_after_digits: boolean
}

export interface DateOptions {
  format: string
  delimiters: string[]
  strictMode: boolean
}

export interface DateObj {
  y: string
  m: string
  d: string
}

export interface DecimalOptions {
  force_decimal: boolean
  decimal_digits: string
  locale: string
}

/**
 * Options for the isEmpty function
 */
export interface IsEmptyOptions {
  /**
   * Consider spaces as empty
   */
  ignoreWhitespace?: boolean
}

export interface IsFloatOptions {
  locale?: string
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface IsFQDNOptions {
  allow_trailing_dot?: boolean | string
  allow_wildcard?: boolean | string
  require_tld?: boolean | string
  allow_numeric_tld?: boolean | string
  ignore_max_length?: number
  allow_underscores?: boolean | string
}

export interface IsIMEIOptions {
  allow_hyphens?: boolean | string
}
export interface IsInOptions {
  hasOwnProperty?: boolean | string
  indexOf?: boolean | string
  includes?: boolean | string
}

export interface IsIntOptions {
  allow_leading_zeroes?: boolean
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface IsIPOptions {
  version?: number
}

export interface IsISBNOptions {
  version?: string | number
}

export interface ISO8601Options {
  strictSeparator?: boolean
  strict?: boolean
}
export interface IsJSONOptions {
  allow_primitives?: boolean | string
}
export interface IsLatLongOptions {
  checkDMS?: boolean | string
}

export interface IsLengthOptions {
  min?: number
  max?: number
  discreteLengths?: boolean | string
}
export interface IsMACAddressOptions {
  eui?: boolean | string
  no_separators?: boolean
  no_colons?: boolean
}
export interface NumericOptions {
  no_symbols?: boolean
  locale?: string
}
export interface IsRgbColorOptions {
  allowSpaces?: boolean
  includePercentValues?: boolean
}

export interface PasswordAnalysis {
  length: number
  uniqueChars: number
  uppercaseCount: number
  lowercaseCount: number
  numberCount: number
  symbolCount: number
}

export interface IsTimeOptions {
  hourFormat: 'hour24' | 'hour12'
  mode: 'default' | 'withSeconds' | 'withOptionalSeconds'
}

export interface IsURLOptions {
  protocols?: string[]
  require_tld?: boolean
  require_protocol?: boolean
  require_host?: boolean
  require_port?: boolean
  require_valid_protocol?: boolean
  allow_underscores?: boolean
  allow_trailing_dot?: boolean
  allow_protocol_relative_urls?: boolean
  allow_fragments?: boolean
  allow_query_components?: boolean
  validate_length?: boolean
  max_allowed_length?: number
  host_whitelist?: (string | RegExp)[]
  host_blacklist?: (string | RegExp)[]
  disallow_auth?: boolean
}

export interface NormalizeEmailOptions {
  gmail_remove_subaddress?: boolean | string
  gmail_remove_dots?: boolean | string
  all_lowercase?: boolean | string
  gmail_lowercase?: boolean | string
  gmail_convert_googlemaildotcom?: boolean | string
  icloud_remove_subaddress?: boolean | string
  icloud_lowercase?: boolean | string
  outlookdotcom_remove_subaddress?: boolean | string
  outlookdotcom_lowercase?: boolean | string
  yahoo_remove_subaddress?: boolean | string
  yahoo_lowercase?: boolean | string
  yandex_lowercase?: boolean | string
  yandex_convert_yandexru?: boolean | string
}

export interface Validator<T> {
  test: (value: T) => boolean
  validate: (value: T) => ValidationResult
  required: () => Validator<T>
  optional: () => Validator<T>
}

export interface ValidationConfig {
  verbose: boolean
  strictMode?: boolean
  cacheResults?: boolean
  errorMessages?: Record<string, string>
}

export interface ValidationInstance {
  string: () => StringValidator
  number: () => NumberValidator
  array: <T>() => ArrayValidator<T>
  boolean: () => BooleanValidator
  enum: <T extends string | number>(values: readonly T[]) => EnumValidator<T>
  date: () => DateValidator
  datetime: () => DatetimeValidator
  object: <T extends Record<string, any>>() => ObjectValidator<T>
  custom: <T>(validationFn: (value: T) => boolean, message: string) => CustomValidator<T>
  timestamp: () => TimestampValidator
  unix: () => UnixValidator
  password: () => PasswordValidator
}
