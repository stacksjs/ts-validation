import type { LengthValidator, Validator } from './base'

export interface DoubleValidatorType extends Validator<number>, LengthValidator<DoubleValidatorType> {
  positive: () => DoubleValidatorType
  negative: () => DoubleValidatorType
  divisibleBy: (divisor: number) => DoubleValidatorType
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => DoubleValidatorType
}
