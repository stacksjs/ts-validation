import type { ObjectValidator } from '../validators/objects'
import type { Validator } from './base'

export interface ObjectValidatorType<T extends Record<string, any>> extends Validator<T> {
  shape: (schema: Record<string, Validator<any>>) => ObjectValidator<T>
  strict: (strict?: boolean) => ObjectValidator<T>
}
