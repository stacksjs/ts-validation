import type { DecimalValidator } from '../validators/decimal'
import type { LengthValidator, Validator } from './base'

export interface DecimalValidatorType extends Validator<number>, LengthValidator<DecimalValidator> {
  positive: () => DecimalValidator
  negative: () => DecimalValidator
  divisibleBy: (divisor: number) => DecimalValidator
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => DecimalValidator
}
