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
