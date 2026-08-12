import type { LengthValidator, Validator } from './base'

export interface ArrayValidatorType<T> extends Validator<T[]>, LengthValidator<ArrayValidatorType<T>> {
  each: <U>(validator: Validator<U>) => ArrayValidatorType<U>
  unique: () => ArrayValidatorType<T>
}
