import type isDecimal from '../lib/isDecimal'
import type { NumberValidator } from '../validators/numbers'
import type { LengthValidator, Validator } from './base'

export interface IsFloatOptions {
  locale?: string
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface IsIntOptions {
  allow_leading_zeroes?: boolean
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface DecimalOptions {
  force_decimal: boolean
  decimal_digits: string
  locale: string
}

export interface NumericOptions {
  no_symbols?: boolean
  locale?: string
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

export interface BigintValidatorType extends NumberValidatorType {}
