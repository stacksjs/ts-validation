import type { BlobValidator } from '../validators/blob'
import type { LengthValidator, Validator } from './base'

export interface BlobValidatorType extends Validator<string>, LengthValidator<BlobValidator> {
  custom: (fn: (value: string) => boolean, message: string) => BlobValidator
}
