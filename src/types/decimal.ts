import type { LengthValidator, Validator } from './base'

export interface DecimalValidatorType extends Validator<number>, LengthValidator<DecimalValidatorType> {
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: number) => this
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => this
}
