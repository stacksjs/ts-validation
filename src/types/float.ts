import type { LengthValidator, Validator } from './base'

export interface FloatOptions {
  locale?: string
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface FloatValidatorType extends Validator<number>, LengthValidator<FloatValidatorType> {
  positive: () => FloatValidatorType
  negative: () => FloatValidatorType
  divisibleBy: (divisor: number) => FloatValidatorType
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => FloatValidatorType
}
