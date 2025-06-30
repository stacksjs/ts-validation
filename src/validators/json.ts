import type { JsonValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class JsonValidator extends BaseValidator<string> implements JsonValidatorType {
  public name: ValidationNames = 'json'

  constructor() {
    super()
    this.addRule({
      name: 'json',
      test: (value: unknown): value is string => {
        if (typeof value !== 'string') {
          return false
        }
        try {
          JSON.parse(value)
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

// Export a function to create JSON validators
export function json(): JsonValidator {
  return new JsonValidator()
}
