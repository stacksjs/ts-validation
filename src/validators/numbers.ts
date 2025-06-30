import type { IsIntOptions, NumberValidatorType, ValidationNames } from '../types'
import isDivisibleBy from '../lib/isDivisibleBy'
import isInt from '../lib/isInt'
import { BaseValidator } from './base'

export class NumberValidator extends BaseValidator<number> implements NumberValidatorType {
  public name: ValidationNames = 'number'

  constructor() {
    super()
    this.addRule({
      name: 'number',
      test: (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value),
      message: 'Must be a number',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value >= min
      },
      message: 'Must be at least {min}',
      params: { min },
    })
  }

  max(max: number): this {
    return this.addRule({
      name: 'max',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value <= max
      },
      message: 'Must be at most {max}',
      params: { max },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value.toString().length === length
      },
      message: 'Must be exactly {length} digits',
      params: { length },
    })
  }

  integer(options?: IsIntOptions): this {
    return this.addRule({
      name: 'integer',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return isInt(String(value), options ?? {})
      },
      message: 'Must be an integer',
    })
  }

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value > 0
      },
      message: 'Must be a positive number',
    })
  }

  negative(): this {
    return this.addRule({
      name: 'negative',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value < 0
      },
      message: 'Must be a negative number',
    })
  }

  divisibleBy(divisor: number): this {
    return this.addRule({
      name: 'divisibleBy',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return isDivisibleBy(String(value), divisor)
      },
      message: 'Must be divisible by {divisor}',
      params: { divisor },
    })
  }

  custom(fn: (value: number | null | undefined) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create number validators
export function number(): NumberValidator {
  return new NumberValidator()
}
