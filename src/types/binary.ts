import type { BinaryValidator } from '../validators/binary'
import type { LengthValidator, Validator } from './base'

export interface BinaryValidatorType extends Validator<string>, LengthValidator<BinaryValidator> {
  custom: (fn: (value: string) => boolean, message: string) => BinaryValidator
}
