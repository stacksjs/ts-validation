import type { ArrayValidator } from '../validators/arrays'
import type { LengthValidator, Validator } from './base'

export interface ArrayValidatorType<T> extends Validator<T[]>, LengthValidator<ArrayValidator<T>> {
  each: (validator: Validator<T>) => ArrayValidator<T>
  unique: () => ArrayValidator<T>
}
