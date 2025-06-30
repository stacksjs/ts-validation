import type { SmallintValidator } from '../validators/smallint'
import type { LengthValidator, Validator } from './base'

export interface SmallintValidatorType extends Validator<number>, LengthValidator<SmallintValidator> {
  positive: () => SmallintValidator
  negative: () => SmallintValidator
  divisibleBy: (divisor: number) => SmallintValidator
  custom: (fn: (value: number) => boolean, message: string) => SmallintValidator
}
