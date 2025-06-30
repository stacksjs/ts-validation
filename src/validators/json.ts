import type { JsonValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class JsonValidator extends BaseValidator<string> implements JsonValidatorType {
  public name: ValidationNames = 'json'

  constructor() {
    super()
    this.addRule({
      name: 'json',
      test: (value: string) => {
        // First check if it's a string
        if (typeof value !== 'string') {
          return false
        }

        // Check if it's empty
        if (value.trim() === '') {
          return false
        }

        try {
          const parsed = JSON.parse(value)
          // By default, reject primitive values
          if (typeof parsed === 'string' || typeof parsed === 'number' || typeof parsed === 'boolean' || parsed === null) {
            return false
          }
          return true
        }
        catch {
          return false
        }
      },
      message: 'Must be a valid JSON string',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length >= min
      },
      message: 'Must be at least {min} characters',
      params: { min },
    })
  }

  max(max: number): this {
    return this.addRule({
      name: 'max',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length <= max
      },
      message: 'Must be at most {max} characters',
      params: { max },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length === length
      },
      message: 'Must be exactly {length} characters',
      params: { length },
    })
  }

  custom(fn: (value: string | null | undefined) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create JSON validators
export function json(): JsonValidator {
  return new JsonValidator()
}
