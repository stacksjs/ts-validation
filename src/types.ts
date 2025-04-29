import type { alphanumeric } from './lib/isAlphanumeric'

export interface ValidationConfig {
  verbose: boolean
  strictMode?: boolean
  cacheResults?: boolean
  errorMessages?: Record<string, string>
}

export type ValidationOptions = Partial<ValidationConfig>

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  value?: any
  rule?: string
}

export interface ValidationRule<T = any> {
  validate: (value: T, options?: any) => boolean
  message: string | ((field: string, value: T, options?: any) => string)
  options?: any
}

export type ValidationSchema = Record<string, ValidationRule[]>

export interface BaseValidator<T = any> {
  validate: (value: T) => ValidationResult
  test: (value: T) => boolean
  required: () => Validator<T>
  optional: () => Validator<T>
  rules: Array<{ test: (val: T) => boolean, message: string, options?: any }>
}

export type Validator<T = any> = Omit<BaseValidator<T>, 'rules'>

export type StringValidator = Validator<string> & {
  min: (length: number) => StringValidator
  max: (length: number) => StringValidator
  length: (length: number) => StringValidator
  email: () => StringValidator
  url: () => StringValidator
  matches: (pattern: RegExp) => StringValidator
  alphanumeric: () => StringValidator
  alpha: () => StringValidator
  numeric: () => StringValidator
}

export type NumberValidator = Validator<number> & {
  min: (min: number) => NumberValidator
  max: (max: number) => NumberValidator
  positive: () => NumberValidator
  negative: () => NumberValidator
  integer: () => NumberValidator
}

export type BooleanValidator = Validator<boolean>

export type ArrayValidator<T = any> = Validator<T[]> & {
  min: (length: number) => ArrayValidator<T>
  max: (length: number) => ArrayValidator<T>
  length: (length: number) => ArrayValidator<T>
  each: (validator: Validator<T>) => ArrayValidator<T>
}

export type ObjectValidator<T = Record<string, any>> = Validator<T> & {
  shape: (schema: Record<string, Validator>) => ObjectValidator<T>
  strict: (strict?: boolean) => ObjectValidator<T>
}

export interface ValidationInstance {
  string: () => StringValidator
  number: () => NumberValidator
  boolean: () => BooleanValidator
  array: <T = any>() => ArrayValidator<T>
  object: <T = Record<string, any>>() => ObjectValidator<T>
  custom: <T = any>(validator: (value: T) => boolean, message: string) => Validator<T>
  clearCache: () => void
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
  locale?: boolean | string
  hasOwnProperty?: boolean | string
  min?: number
  max?: number
  lt?: boolean | string
  gt?: boolean | string
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
