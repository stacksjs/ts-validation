import type { LengthValidator, Validator } from './base'

export interface IsIntOptions {
  allow_leading_zeroes?: boolean
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface NumericOptions {
  no_symbols?: boolean
  locale?: string
}

export interface NumberValidatorType extends Validator<number>, LengthValidator<NumberValidatorType> {
  integer: (options?: IsIntOptions) => NumberValidatorType
  positive: () => NumberValidatorType
  negative: () => NumberValidatorType
  divisibleBy: (divisor: number) => NumberValidatorType
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => NumberValidatorType
}

export interface BigintValidatorType extends Validator<bigint> {
  min: (min: bigint) => BigintValidatorType
  positive: () => BigintValidatorType
  negative: () => BigintValidatorType
  divisibleBy: (divisor: bigint) => BigintValidatorType
  custom: (fn: (value: bigint) => boolean, message: string) => BigintValidatorType
}
