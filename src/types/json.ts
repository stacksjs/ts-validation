import type { JsonValidator } from '../validators/json'
import type { LengthValidator, Validator } from './base'

export interface JsonValidatorType extends Validator<string>, LengthValidator<JsonValidator> {
  custom: (fn: (value: string) => boolean, message: string) => JsonValidator
}
