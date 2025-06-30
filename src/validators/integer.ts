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

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number | null | undefined) => {
        if (typeof value !== 'number')
          return false
        return value > 0
      },
      message: 'Must be a positive integer',
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
      message: 'Must be a negative integer',
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

// Export a function to create integer validators
export function integer(): IntegerValidator {
  return new IntegerValidator()
}
