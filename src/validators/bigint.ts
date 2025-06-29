import type { BigintValidatorType, ValidationNames } from '../types'
import { NumberValidator } from './numbers'

export class BigintValidator extends NumberValidator implements BigintValidatorType {
  public name: ValidationNames = 'bigint'

  constructor() {
    super()
    this.addRule({
      name: 'bigint',
      test: (value: unknown): value is bigint => typeof value === 'bigint',
      message: 'Must be a bigint',
    })
  }
}

export function bigint(): BigintValidator {
  return new BigintValidator()
}
