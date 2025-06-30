import type { LengthValidator, Validator } from './base'

export interface JsonValidatorType extends Validator<string>, LengthValidator<any> {
  custom: (fn: (value: string | null | undefined) => boolean, message: string) => any
}
