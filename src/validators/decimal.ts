import type { DecimalValidatorType, ValidationNames } from '../types'
import isDivisibleBy from '../lib/isDivisibleBy'
import { NumberValidator } from './numbers'

export class DecimalValidator extends NumberValidator implements DecimalValidatorType {
  public name: ValidationNames = 'decimal'

  constructor() {
    super()
    this.addRule({
      name: 'decimal',
      test: (value: unknown): value is number => {
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

  // Override test method to handle type checking
  test(value: unknown): boolean {
    return this.validate(value as number).valid
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

  validate(value: number | undefined | null): any {
    // Only allow actual numbers
    if (typeof value !== 'number' || Number.isNaN(value)) {
      const error = { message: 'This field is required' }
      return this.isPartOfShape
        ? { valid: false, errors: { [this.fieldName]: [error] } }
        : { valid: false, errors: [error] }
    }
    // Otherwise, use the base validation
    return super.validate(value)
  }
}

// Export a function to create decimal validators
export function decimal(): DecimalValidator {
  return new DecimalValidator()
}
