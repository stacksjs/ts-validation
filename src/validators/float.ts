import type { FloatValidatorType, ValidationNames } from '../types'
import isDivisibleBy from '../lib/isDivisibleBy'
import { NumberValidator } from './numbers'

export class FloatValidator extends NumberValidator implements FloatValidatorType {
  public name: ValidationNames = 'float'

  constructor() {
    super()
    // Override the base number validation to ensure it's a float
    // Remove the existing number rule and add our own
    this.rules = this.rules.filter(rule => rule.name !== 'number')
    this.addRule({
      name: 'float',
      test: (value: unknown): value is number => {
        // First check if it's a number
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return false
        }
        // All numbers in JavaScript are floats, including Infinity
        return true
      },
      message: 'Must be a valid float number',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: number) => {
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
      test: (value: number) => {
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
      test: (value: number) => {
        if (typeof value !== 'number')
          return false
        return value.toString().length === length
      },
      message: 'Must be exactly {length} digits',
      params: { length },
    })
  }

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number) => {
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
      test: (value: number) => {
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
      test: (value: number) => {
        if (typeof value !== 'number')
          return false
        return isDivisibleBy(String(value), divisor)
      },
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
