import type { DecimalValidatorType, ValidationNames } from '../types'
import isDivisibleBy from '../lib/isDivisibleBy'
import { NumberValidator } from './numbers'

export class DecimalValidator extends NumberValidator implements DecimalValidatorType {
  public name: ValidationNames = 'decimal'

  constructor() {
    super()
    this.addRule({
      name: 'decimal',
      test: (value: number) => {
        // First check if it's a number
        if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
          return false
        }
        // Check if it's a finite number (all numbers in JS are decimals)
        return true
      },
      message: 'Must be a valid decimal number',
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

// Export a function to create decimal validators
export function decimal(): DecimalValidator {
  return new DecimalValidator()
}
