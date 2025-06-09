import type { CustomValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class CustomValidator<T> extends BaseValidator<T> implements CustomValidatorType<T> {
  public name: ValidationNames = 'custom'

  constructor(validationFn: (value: T) => boolean, message: string) {
    super()
    this.addRule({
      name: 'custom',
      test: (value: T) => value === undefined || value === null || validationFn(value),
      message,
    })
  }
}

export function custom<T>(
  validationFn: (value: T) => boolean,
  message: string,
): CustomValidator<T> {
  return new CustomValidator<T>(validationFn, message)
}
