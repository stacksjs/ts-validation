import type { ValidationError, ValidationResult, Validator } from '../types'
import { BaseValidator } from './base'

export class ObjectValidator<T extends Record<string, any>> extends BaseValidator<T> {
  private schema: Record<string, Validator<any>> = {}
  private strictMode = false

  constructor() {
    super()
    this.addRule({
      name: 'object',
      test: (value: unknown): value is T =>
        typeof value === 'object' && value !== null && !Array.isArray(value),
      message: 'Must be an object',
    })
  }

  shape(schema: Record<string, Validator<any>>): this {
    this.schema = schema
    return this.addRule({
      name: 'shape',
      test: (value: T) => {
        // If value is null/undefined, let the required/optional rules handle it
        if (value === null || value === undefined)
          return true

        // In strict mode, check for extra fields
        if (this.strictMode) {
          const schemaKeys = new Set(Object.keys(schema))
          const valueKeys = Object.keys(value)
          return valueKeys.every(key => schemaKeys.has(key))
        }

        return true
      },
      message: 'Invalid object shape',
    })
  }

  strict(strict = true): this {
    this.strictMode = strict
    return this
  }

  validate(value: T): ValidationResult {
    const result = super.validate(value)

    // If the base validation passed and we have a schema, validate each field
    if (result.valid && Object.keys(this.schema).length > 0 && value !== null && value !== undefined) {
      const fieldErrors: ValidationError[] = []

      for (const [key, validator] of Object.entries(this.schema)) {
        const fieldValue = value[key]
        const fieldResult = validator.validate(fieldValue)

        if (!fieldResult.valid) {
          fieldErrors.push(
            ...fieldResult.errors.map(error => ({
              ...error,
              field: key,
              message: `${key}: ${error.message}`,
            })),
          )
        }
      }

      if (fieldErrors.length > 0) {
        return {
          valid: false,
          errors: fieldErrors,
        }
      }
    }

    return result
  }
}

export function object<T extends Record<string, any>>(): ObjectValidator<T> {
  return new ObjectValidator<T>()
}
