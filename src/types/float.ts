import type { FloatValidator } from '../validators/float'
import type { LengthValidator, Validator } from './base'

export interface FloatOptions {
  locale?: string
  min?: number
  max?: number
  lt?: number
  gt?: number
}

export interface FloatValidatorType extends Validator<number>, LengthValidator<FloatValidator> {
  positive: () => FloatValidator
  negative: () => FloatValidator
  divisibleBy: (divisor: number) => FloatValidator
  custom: (fn: (value: number) => boolean, message: string) => FloatValidator
}
