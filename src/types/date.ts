import type { Validator } from './base'

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

export interface IsBeforeOptions {
  comparisonDate?: string | number | Date
}

export interface IsAfterOptions {
  comparisonDate?: string | number | Date
}

export interface DateValidatorType extends Validator<Date> {
  // Base date validator is simple, just implements the base Validator interface
}

export interface DatetimeValidatorType extends Validator<Date> {
  // Datetime validator is simple, just implements the base Validator interface
}
