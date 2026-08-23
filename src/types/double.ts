import type { LengthValidator, Validator } from './base'

export interface DoubleValidatorType extends Validator<number>, LengthValidator<DoubleValidatorType> {
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: number) => this
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => this
}
