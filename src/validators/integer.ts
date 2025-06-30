import type { IntegerValidatorType, ValidationNames } from '../types'
import { NumberValidator } from './numbers'

export class IntegerValidator extends NumberValidator implements IntegerValidatorType {
  public name: ValidationNames = 'integer'

  constructor() {
    super()
    // Override the base number validation to ensure it's an integer
    // Remove the existing number rule and add our own
    this.rules = this.rules.filter(rule => rule.name !== 'number')
    this.addRule({
      name: 'number',
      test: (value: unknown): value is number => {
        // First check if it's a number
        if (typeof value !== 'number' || Number.isNaN(value) || !Number.isFinite(value)) {
          return false
        }
        // Then check if it's an integer
        return Number.isInteger(value)
      },
      message: 'Must be a valid integer',
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

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number) => value > 0,
      message: 'Must be a positive integer',
    })
  }

  negative(): this {
    return this.addRule({
      name: 'negative',
      test: (value: number) => value < 0,
      message: 'Must be a negative integer',
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

// Export a function to create integer validators
export function integer(): IntegerValidator {
  return new IntegerValidator()
}
