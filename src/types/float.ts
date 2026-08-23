import type { LengthValidator, Validator } from './base'

export interface FloatOptions {
  locale?: string
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface FloatValidatorType extends Validator<number>, LengthValidator<FloatValidatorType> {
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: number) => this
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => this
}
