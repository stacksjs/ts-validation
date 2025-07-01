import type { LengthValidator, Validator } from './base'

export interface SmallintValidatorType extends Validator<number>, LengthValidator<SmallintValidatorType> {
  positive: () => SmallintValidatorType
  negative: () => SmallintValidatorType
  divisibleBy: (divisor: number) => SmallintValidatorType
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => SmallintValidatorType
}
