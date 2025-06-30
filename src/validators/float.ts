import type { FloatOptions, FloatValidatorType, ValidationNames } from '../types'
import isDivisibleBy from '../lib/isDivisibleBy'
import isFloat from '../lib/isFloat'
import { BaseValidator } from './base'

export class FloatValidator extends BaseValidator<number> implements FloatValidatorType {
  public name: ValidationNames = 'float'

  constructor() {
    super()
    this.addRule({
      name: 'float',
      test: (value: unknown): value is number => {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return false
        }
        return isFloat(String(value), {})
      },
      message: 'Must be a valid float number',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: number) => value >= min,
      message: 'Must be at least {min}',
      params: { min },
    })
  }

  max(max: number): this {
    return this.addRule({
      name: 'max',
      test: (value: number) => value <= max,
      message: 'Must be at most {max}',
      params: { max },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: number) => value.toString().length === length,
      message: 'Must be exactly {length} digits',
      params: { length },
    })
  }

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number) => value > 0,
      message: 'Must be a positive number',
    })
  }

  negative(): this {
    return this.addRule({
      name: 'negative',
      test: (value: number) => value < 0,
      message: 'Must be a negative number',
    })
  }

  divisibleBy(divisor: number): this {
    return this.addRule({
      name: 'divisibleBy',
      test: (value: number) => isDivisibleBy(String(value), divisor),
      message: 'Must be divisible by {divisor}',
      params: { divisor },
    })
  }

  custom(fn: (value: number) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create float validators
export function float(): FloatValidator {
  return new FloatValidator()
}
