import type { LengthValidator, Validator } from './base'

export interface BinaryValidatorType extends Validator<string>, LengthValidator<BinaryValidatorType> {
  custom: (fn: (value: string) => boolean, message: string) => BinaryValidatorType
}
