import type { BigintValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class BigintValidator extends BaseValidator<bigint> implements BigintValidatorType {
  public name: ValidationNames = 'bigint'

  constructor() {
    super()
    this.addRule({
      name: 'bigint',
      test: (value: unknown): value is bigint => typeof value === 'bigint',
      message: 'Must be a bigint',
    })
  }

  min(min: bigint): BigintValidatorType {
    return this.addRule({
      name: 'min',
      test: (value: bigint) => value >= min,
      message: 'Must be at least {min}',
      params: { min },
    })
  }

  max(max: bigint): BigintValidatorType {
    return this.addRule({
      name: 'max',
      test: (value: bigint) => value <= max,
      message: 'Must be at most {max}',
      params: { max },
    })
  }

  length(length: number): BigintValidatorType {
    return this.addRule({
      name: 'length',
      test: (value: bigint) => value.toString().length === length,
      message: 'Must be {length} digits',
      params: { length },
    })
  }

  positive(): BigintValidatorType {
    return this.addRule({
      name: 'positive',
      test: (value: bigint) => value > 0n,
      message: 'Must be a positive bigint',
    })
  }

  negative(): BigintValidatorType {
    return this.addRule({
      name: 'negative',
      test: (value: bigint) => value < 0n,
      message: 'Must be a negative bigint',
    })
  }

  divisibleBy(divisor: bigint): BigintValidatorType {
    return this.addRule({
      name: 'divisibleBy',
      test: (value: bigint) => value % divisor === 0n,
      message: 'Must be divisible by {divisor}',
      params: { divisor },
    })
  }

  custom(fn: (value: bigint) => boolean, message: string): BigintValidatorType {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

export function bigint(): BigintValidator {
  return new BigintValidator()
}
