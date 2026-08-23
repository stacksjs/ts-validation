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
  integer: (options?: IsIntOptions) => this
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: number) => this
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => this
}

export interface BigintValidatorType extends Validator<bigint> {
  min: (min: bigint) => this
  max: (max: bigint) => this
  length: (length: number) => this
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: bigint) => this
  custom: (fn: (value: bigint) => boolean, message: string) => this
}
