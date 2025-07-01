import type { LengthValidator, Validator } from './base'

export interface BlobValidatorType extends Validator<string>, LengthValidator<BlobValidatorType> {
  custom: (fn: (value: string) => boolean, message: string) => BlobValidatorType
}
