import type { alphanumeric } from './lib/isAlphanumeric'
import type isDecimal from './lib/isDecimal'
import type isEmail from './lib/isEmail'
import type isURL from './lib/isURL'
import type { ArrayValidator } from './validators/arrays'
import type { BooleanValidator } from './validators/booleans'
import type { CustomValidator } from './validators/custom'
import type { EnumValidator } from './validators/enums'
import type { NumberValidator } from './validators/numbers'
import type { ObjectValidator } from './validators/objects'
import type { PasswordValidator } from './validators/password'
import type { StringValidator } from './validators/strings'

// Define unique symbols for schema properties
export const SCHEMA_NAME: unique symbol = Symbol('schema_name')
export const INPUT_TYPE: unique symbol = Symbol('input_type')
export const OUTPUT_TYPE: unique symbol = Symbol('output_type')
export const COMPUTED_TYPE: unique symbol = Symbol('computed_type')
export const PARSE: unique symbol = Symbol('parse')

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
  name: ValidationNames
  getRules: () => ValidationRule<T>[]
  test: (value: T) => boolean
  validate: (value: T) => ValidationResult
  required: () => this
  optional: () => this
}

// Internal interface for implementation details
export interface ValidatorInternal<T> extends Validator<T> {
  isPartOfShape: boolean
  rules: ValidationRule<T>[]
}

export interface ValidationConfig {
  verbose: boolean
  strictMode?: boolean
  cacheResults?: boolean
  errorMessages?: Record<string, string>
}

export interface LengthValidator<T> {
  min: (length: number) => T
  max: (length: number) => T
  length: (length: number) => T
}

export interface StringValidatorType extends Validator<string>, LengthValidator<StringValidator> {
  email: (options?: Parameters<typeof isEmail>[1]) => StringValidator
  url: (options?: Parameters<typeof isURL>[1]) => StringValidator
  matches: (pattern: RegExp) => StringValidator
  equals: (param: string) => StringValidator
  alphanumeric: () => StringValidator
  alpha: () => StringValidator
  numeric: () => StringValidator
  custom: (fn: (value: string) => boolean, message: string) => StringValidator
}

export interface NumberValidatorType extends Validator<number>, LengthValidator<NumberValidator> {
  integer: (options?: IsIntOptions) => NumberValidator
  float: (options?: IsFloatOptions) => NumberValidator
  decimal: (options?: Parameters<typeof isDecimal>[1]) => NumberValidator
  positive: () => NumberValidator
  negative: () => NumberValidator
  divisibleBy: (divisor: number) => NumberValidator
  custom: (fn: (value: number) => boolean, message: string) => NumberValidator
}

export interface ArrayValidatorType<T> extends Validator<T[]>, LengthValidator<ArrayValidator<T>> {
  each: (validator: Validator<T>) => ArrayValidator<T>
  unique: () => ArrayValidator<T>
}

export interface BooleanValidatorType extends Validator<boolean> {
  isTrue: () => BooleanValidator
  isFalse: () => BooleanValidator
  custom: (fn: (value: boolean) => boolean, message: string) => BooleanValidator
}

export interface EnumValidatorType<T extends string | number> extends Validator<T> {
  getAllowedValues: () => readonly T[]
  custom: (fn: (value: T) => boolean, message: string) => EnumValidator<T>
}

export interface DateValidatorType extends Validator<Date> {
  // Base date validator is simple, just implements the base Validator interface
}

export interface DatetimeValidatorType extends Validator<Date> {
  // Datetime validator is simple, just implements the base Validator interface
}

export interface ObjectValidatorType<T extends Record<string, any>> extends Validator<T> {
  shape: (schema: Record<string, Validator<any>>) => ObjectValidator<T>
  strict: (strict?: boolean) => ObjectValidator<T>
}

export interface CustomValidatorType<T> extends Validator<T> {
  // Custom validator is simple, just implements the base Validator interface
}

export interface TimestampValidatorType extends Validator<number | string> {
  // Timestamp validator is simple, just implements the base Validator interface
}

export interface UnixValidatorType extends Validator<number | string> {
  // Unix validator is simple, just implements the base Validator interface
}

export interface PasswordValidatorType extends Validator<string>, LengthValidator<PasswordValidator> {
  matches: (confirmPassword: string) => PasswordValidator
  hasUppercase: () => PasswordValidator
  hasLowercase: () => PasswordValidator
  hasNumbers: () => PasswordValidator
  hasSpecialCharacters: () => PasswordValidator
  alphanumeric: () => PasswordValidator
}

export interface ValidationInstance {
  string: () => StringValidatorType
  number: () => NumberValidatorType
  array: <T>() => ArrayValidatorType<T>
  boolean: () => BooleanValidatorType
  enum: <T extends string | number>(values: readonly T[]) => EnumValidatorType<T>
  date: () => DateValidatorType
  datetime: () => DatetimeValidatorType
  object: <T extends Record<string, any>>() => ObjectValidatorType<T>
  custom: <T>(validationFn: (value: T) => boolean, message: string) => CustomValidator<T>
  timestamp: () => TimestampValidatorType
  unix: () => UnixValidatorType
  password: () => PasswordValidatorType
}

export type ValidationType = StringValidatorType | NumberValidatorType | ArrayValidatorType<string | number | boolean | Date> | BooleanValidatorType | EnumValidatorType<string | number> | DateValidatorType | DatetimeValidatorType | ObjectValidatorType<Record<string, any>> | CustomValidatorType<Record<string, any>> | TimestampValidatorType | UnixValidatorType | PasswordValidatorType

export type Infer<T> = T extends Validator<infer U> ? U : never

export type ValidationNames = 'base' | 'string' | 'number' | 'array' | 'boolean' | 'enum' | 'date' | 'datetime' | 'object' | 'custom' | 'timestamp' | 'unix' | 'password'
