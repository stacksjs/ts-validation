import type { LengthValidator, Validator } from './base'

export interface SmallintValidatorType extends Validator<number>, LengthValidator<SmallintValidatorType> {
  positive: () => this
  negative: () => this
  divisibleBy: (divisor: number) => this
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => this
}
