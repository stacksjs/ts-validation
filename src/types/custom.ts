import type { Validator } from './base'

export interface CustomValidatorType<T> extends Validator<T> {
  // Custom validator is simple, just implements the base Validator interface
}
