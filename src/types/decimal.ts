import type { LengthValidator, Validator } from './base'

export interface DecimalValidatorType extends Validator<number>, LengthValidator<DecimalValidatorType> {
  positive: () => DecimalValidatorType
  negative: () => DecimalValidatorType
  divisibleBy: (divisor: number) => DecimalValidatorType
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => DecimalValidatorType
}
