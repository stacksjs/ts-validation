import type { BinaryValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class BinaryValidator extends BaseValidator<string> implements BinaryValidatorType {
  public name: ValidationNames = 'binary'

  constructor() {
    super()
    this.addRule({
      name: 'binary',
      test: (value: unknown): value is string => {
        if (typeof value !== 'string') {
          return false
        }
        // Basic binary validation - could be base64 encoded data or hex string
        // This is a simple check, could be enhanced based on specific requirements
        return value.length > 0
      },
      message: 'Must be a valid binary string',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: string) => value.length >= min,
      message: 'Must be at least {min} characters',
      params: { min },
    })
  }

  max(max: number): this {
    return this.addRule({
      name: 'max',
      test: (value: string) => value.length <= max,
      message: 'Must be at most {max} characters',
      params: { max },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: string) => value.length === length,
      message: 'Must be exactly {length} characters',
      params: { length },
    })
  }

  custom(fn: (value: string) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create binary validators
export function binary(): BinaryValidator {
  return new BinaryValidator()
}
