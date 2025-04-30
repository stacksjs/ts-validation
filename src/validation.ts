import type {
  ArrayValidator,
  BaseValidator,
  BooleanValidator,
  NumberValidator,
  ObjectValidator,
  StringValidator,
  ValidationError,
  ValidationResult,
  Validator,
} from './types'
import { config } from './config'

// Result cache for performance optimization when enabled
const resultsCache = new Map<string, ValidationResult>()

/**
 * Format error message with placeholders
 */
function formatMessage(message: string | ((field: string, value: any, options?: any) => string), params: Record<string, any>): string {
  // If the message is a function, call it with the params
  if (typeof message === 'function') {
    return message(params.field, params.value, params)
  }

  // Replace placeholders in the message
  return message.replace(/\{([^}]+)\}/g, (_, key) => {
    console.log(key)
    // Handle nested properties (e.g., options.min)
    const value = key.split('.').reduce((obj, k) => obj?.[k], params)
    return value !== undefined ? String(value) : `{${key}}`
  })
}

/**
 * Create a validation error
 */
function createError(field: string, rule: string, value: any, options?: any): ValidationError {
  const template = config.errorMessages?.[rule] || rule
  const message = formatMessage(template, { field, ...options, value })
  return {
    field,
    message,
    value,
    rule,
  }
}

/**
 * Base validator implementation
 */
function createBaseValidator<T>(type: string): BaseValidator<T> {
  let isRequired = true
  const rules: Array<{ test: (val: T) => boolean, message: string, options?: any }> = []

  // Default type check rule
  rules.push({
    test: (val: T) => {
      if (val === undefined || val === null)
        return !isRequired

      switch (type) {
        case 'string': return typeof val === 'string'
        case 'number': return typeof val === 'number' && !Number.isNaN(val as number & {})
        case 'boolean': return typeof val === 'boolean'
        case 'array': return Array.isArray(val)
        case 'object': return val !== null && typeof val === 'object' && !Array.isArray(val)
        default: return true
      }
    },
    message: config.errorMessages?.[type] || `Value must be a ${type}`,
  })

  const validator: BaseValidator<T> = {
    rules,
    validate: (value: T): ValidationResult => {
      // Generate a cache key if caching is enabled
      let cacheKey: string | undefined
      if (config.cacheResults) {
        cacheKey = `${type}:${JSON.stringify(value)}:${isRequired}:${JSON.stringify(rules)}`
        const cached = resultsCache.get(cacheKey)
        if (cached)
          return cached
      }

      const errors: ValidationError[] = []

      for (const rule of rules) {
        if (!rule.test(value)) {
          errors.push(createError('value', rule.message, value, rule.options))

          if (config.strictMode)
            break // Stop on first error in strict mode
        }
      }

      const result = { valid: errors.length === 0, errors }

      // Cache the result if enabled
      if (config.cacheResults && cacheKey) {
        resultsCache.set(cacheKey, result)
      }

      return result
    },

    test: (value: T): boolean => {
      return validator.validate(value).valid
    },

    required: () => {
      isRequired = true
      return validator as unknown as Validator<T>
    },

    optional: () => {
      isRequired = false
      return validator as unknown as Validator<T>
    },
  }

  return validator
}

/**
 * String validator implementation
 */
function createStringValidator(): StringValidator {
  const baseValidator = createBaseValidator<string>('string')
  const validator = baseValidator as unknown as StringValidator

  // Add string-specific validation methods
  validator.min = (min: number): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || val.length >= min,
      message: 'min',
      options: { min },
    }

    baseValidator.rules.push(rule)
    return validator
  }

  validator.max = (max: number): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || val.length <= max,
      message: 'max',
      options: { max },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.length = (length: number): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || val.length === length,
      message: 'length',
      options: { length },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.email = (): StringValidator => {
    // Fast but effective email regex
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
    const rule = {
      test: (val: string) => val === undefined || val === null || emailRegex.test(val),
      message: 'email',
    }

    baseValidator.rules.push(rule)
    return validator
  }

  validator.url = (): StringValidator => {
    // Simple URL regex for performance
    const urlRegex = /^https?:\/\/[^\s/$.?#].\S*$/i
    const rule = {
      test: (val: string) => val === undefined || val === null || urlRegex.test(val),
      message: 'url',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.matches = (pattern: RegExp): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || pattern.test(val),
      message: 'matches',
      options: { pattern: pattern.toString() },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.alphanumeric = (): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || /^[a-z0-9]+$/i.test(val),
      message: 'alphanumeric',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.alpha = (): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || /^[a-z]+$/i.test(val),
      message: 'alpha',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.numeric = (): StringValidator => {
    const rule = {
      test: (val: string) => val === undefined || val === null || /^\d+$/.test(val),
      message: 'numeric',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  return validator
}

/**
 * Number validator implementation
 */
function createNumberValidator(): NumberValidator {
  const baseValidator = createBaseValidator<number>('number')
  const validator = baseValidator as unknown as NumberValidator

  validator.min = (min: number) => {
    const rule = {
      test: (val: number) => val === undefined || val === null || val >= min,
      message: config.errorMessages?.min || `Must be at least ${min}`,
      options: { min },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.max = (max: number) => {
    const rule = {
      test: (val: number) => val === undefined || val === null || val <= max,
      message: config.errorMessages?.max || `Must be at most ${max}`,
      options: { max },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.positive = () => {
    const rule = {
      test: (val: number) => val === undefined || val === null || val > 0,
      message: config.errorMessages?.positive || 'Must be positive',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.negative = () => {
    const rule = {
      test: (val: number) => val === undefined || val === null || val < 0,
      message: config.errorMessages?.negative || 'Must be negative',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.integer = () => {
    const rule = {
      test: (val: number) => val === undefined || val === null || Number.isInteger(val),
      message: config.errorMessages?.integer || 'Must be an integer',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  return validator
}

/**
 * Boolean validator implementation
 */
function createBooleanValidator(): BooleanValidator {
  const baseValidator = createBaseValidator<boolean>('boolean')
  return baseValidator as unknown as BooleanValidator
}

/**
 * Array validator implementation
 */
function createArrayValidator<T>(): ArrayValidator<T> {
  const baseValidator = createBaseValidator<T[]>('array')
  const validator = baseValidator as unknown as ArrayValidator<T>
  let itemValidator: Validator<T> | null = null

  validator.min = (min: number) => {
    const rule = {
      test: (val: T[]) => val === undefined || val === null || val.length >= min,
      message: config.errorMessages?.min || `Must have at least ${min} items`,
      options: { min },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.max = (max: number) => {
    const rule = {
      test: (val: T[]) => val === undefined || val === null || val.length <= max,
      message: config.errorMessages?.max || `Must have at most ${max} items`,
      options: { max },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.length = (length: number) => {
    const rule = {
      test: (val: T[]) => val === undefined || val === null || val.length === length,
      message: config.errorMessages?.length || `Must have exactly ${length} items`,
      options: { length },
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.each = (itemVal: Validator<T>) => {
    itemValidator = itemVal
    const rule = {
      test: (val: T[]) => {
        if (val === undefined || val === null)
          return true
        return val.every(item => itemVal.test(item))
      },
      message: 'Each item in array is invalid',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  // Override validate to include validation of array items
  const originalValidate = baseValidator.validate
  baseValidator.validate = (value: T[]): ValidationResult => {
    const result = originalValidate(value)

    // If the array itself is valid and we have an item validator, check each item
    if (result.valid && itemValidator && value && Array.isArray(value)) {
      const itemErrors: ValidationError[] = []

      for (let i = 0; i < value.length; i++) {
        const itemResult = itemValidator.validate(value[i])
        if (!itemResult.valid) {
          // Add array index to the field name
          itemResult.errors.forEach((err) => {
            itemErrors.push({
              ...err,
              field: `[${i}]${err.field !== 'value' ? `.${err.field}` : ''}`,
            })
          })

          if (config.strictMode)
            break // Stop on first error in strict mode
        }
      }

      if (itemErrors.length > 0) {
        result.valid = false
        result.errors = [...result.errors, ...itemErrors]
      }
    }

    return result
  }

  return validator
}

/**
 * Object validator implementation
 */
function createObjectValidator<T = Record<string, any>>(): ObjectValidator<T> {
  const baseValidator = createBaseValidator<T>('object')
  const validator = baseValidator as unknown as ObjectValidator<T>
  let schema: Record<string, Validator> = {}
  let strictValidation = false

  validator.shape = (shapeSchema: Record<string, Validator>) => {
    schema = shapeSchema
    const rule = {
      test: (val: T) => {
        if (val === undefined || val === null)
          return true

        // In non-strict mode, just check that it's an object
        if (!strictValidation)
          return true

        // In strict mode, make sure all properties are defined in the schema
        const objectKeys = Object.keys(val as unknown as object)
        const schemaKeys = Object.keys(schema)
        return objectKeys.every(key => schemaKeys.includes(key))
      },
      message: 'Object contains undefined properties',
    }
    baseValidator.rules.push(rule)
    return validator
  }

  validator.strict = (strict = true) => {
    strictValidation = strict
    return validator
  }

  // Override validate to include validation of object properties
  const originalValidate = baseValidator.validate
  baseValidator.validate = (value: T): ValidationResult => {
    const result = originalValidate(value)

    // If the object itself is valid and we have a schema, check each property
    if (result.valid && Object.keys(schema).length > 0 && value && typeof value === 'object') {
      const propErrors: ValidationError[] = []

      for (const [key, propValidator] of Object.entries(schema)) {
        const propValue = (value as any)[key]
        const propResult = propValidator.validate(propValue)

        if (!propResult.valid) {
          // Add property name to the field name
          propResult.errors.forEach((err) => {
            propErrors.push({
              ...err,
              field: `${key}${err.field !== 'value' ? `.${err.field}` : ''}`,
            })
          })

          if (config.strictMode)
            break // Stop on first error in strict mode
        }
      }

      if (propErrors.length > 0) {
        result.valid = false
        result.errors = [...result.errors, ...propErrors]
      }
    }

    return result
  }

  return validator
}

/**
 * Custom validator
 */
function createCustomValidator<T>(
  validationFn: (value: T) => boolean,
  message: string,
): Validator<T> {
  const baseValidator = createBaseValidator<T>('custom')

  const rule = {
    test: (val: T) => val === undefined || val === null || validationFn(val),
    message,
  }

  baseValidator.rules.push(rule)

  return baseValidator as unknown as Validator<T>
}

/**
 * Main validation API
 */
export const v = {
  string: createStringValidator,
  number: createNumberValidator,
  boolean: createBooleanValidator,
  array: createArrayValidator,
  object: createObjectValidator,
  custom: createCustomValidator,

  // Clear cache if needed
  clearCache: () => {
    resultsCache.clear()
  },
}
