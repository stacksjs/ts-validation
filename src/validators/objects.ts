import type { ObjectValidatorType, ValidationErrorMap, ValidationNames, ValidationResult, Validator } from '../types'
import { BaseValidator } from './base'

export class ObjectValidator<T extends Record<string, any>> extends BaseValidator<T> implements ObjectValidatorType<T> {
  public name: ValidationNames = 'object'

  private schema: Record<string, Validator<any>> = {}
  private strictMode = false

  constructor(schema?: Record<string, Validator<any>>) {
    super()
    this.addRule({
      name: 'object',
      test: (value: unknown): value is T =>
        typeof value === 'object' && value !== null && !Array.isArray(value),
      message: 'Must be an object',
    })

    // If schema is provided in constructor, set it up immediately
    if (schema) {
      this.shape(schema)
    }
  }

  shape(schema: Record<string, Validator<any>>): this {
    this.schema = Object.entries(schema).reduce((acc, [key, validator]) => {
      if (validator instanceof BaseValidator) {
        acc[key] = validator.setIsPartOfShape(true).setFieldName(key)
      }
      else {
        acc[key] = validator
      }
      return acc
    }, {} as Record<string, Validator<any>>)

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

  custom(validationFn: (value: T) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: (value: T) => value === undefined || value === null || validationFn(value),
      message,
    })
  }

  validate(value: T): ValidationResult {
    const result = super.validate(value)
    if (!result.valid)
      return result

    // If we have a schema, validate each field
    if (Object.keys(this.schema).length > 0 && value !== null && value !== undefined) {
      const errors: ValidationErrorMap = {}
      let hasErrors = false

      for (const [key, validator] of Object.entries(this.schema)) {
        const fieldValue = value[key]
        const fieldResult = validator.validate(fieldValue)

        if (!fieldResult.valid) {
          hasErrors = true
          // For nested objects, merge their error maps
          if (validator instanceof ObjectValidator) {
            Object.entries(fieldResult.errors).forEach(([errorKey, errorValue]) => {
              errors[`${key}.${errorKey}`] = errorValue
            })
          }
          else {
            // For direct field errors, preserve the original error messages
            const fieldErrors = Object.values(fieldResult.errors)[0]
            if (fieldErrors) {
              errors[key] = fieldErrors
            }
          }
        }
      }

      if (hasErrors) {
        return {
          valid: false,
          errors,
        }
      }
    }

    return result
  }
}

export function object<T extends Record<string, any>>(schema?: Record<string, Validator<any>>): ObjectValidator<T> {
  return new ObjectValidator<T>(schema)
}
