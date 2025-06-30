import type { IntegerValidatorType, ValidationNames } from '../types'
import isInt from '../lib/isInt'
import { NumberValidator } from './numbers'

export class IntegerValidator extends NumberValidator implements IntegerValidatorType {
  public name: ValidationNames = 'integer'

  constructor() {
    super()
    // Override the base number validation to ensure it's an integer
    this.addRule({
      name: 'integer',
      test: (value: unknown): value is number => {
        if (typeof value !== 'number' || Number.isNaN(value)) {
          return false
        }
        return isInt(String(value), {})
      },
      message: 'Must be a valid integer',
    })
  }
}

// Export a function to create integer validators
export function integer(): IntegerValidator {
  return new IntegerValidator()
}
