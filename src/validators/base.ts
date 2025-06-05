import type { ValidationError, ValidationErrorMap, ValidationResult, ValidationRule } from '../types'

export abstract class BaseValidator<T> {
  protected rules: ValidationRule<T>[] = []
  protected isRequired = true
  protected fieldName = 'value'

  required(): this {
    this.isRequired = true
    return this
  }

  optional(): this {
    this.isRequired = false
    return this
  }

  field(name: string): this {
    this.fieldName = name
    return this
  }

  protected addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T | undefined | null): ValidationResult {
    const errors: ValidationErrorMap = {}

    if ((value === undefined || value === null)) {
      if (!this.isRequired) {
        return { valid: true, errors: {} }
      }
      else {
        errors[this.fieldName] = [{
          message: 'This field is required',
        }]
        return { valid: false, errors }
      }
    }

    const fieldErrors: ValidationError[] = []

    for (const rule of this.rules) {
      if (!rule.test(value)) {
        fieldErrors.push({
          message: this.formatMessage(rule.message, rule.params ?? {}),
        })
      }
    }

    if (fieldErrors.length > 0) {
      errors[this.fieldName] = fieldErrors
    }

    return { valid: Object.keys(errors).length === 0, errors }
  }

  test(value: T): boolean {
    return this.validate(value).valid
  }

  private formatMessage(message: string, params: Record<string, any>): string {
    return message.replace(/\{([^}]+)\}/g, (_, key) => {
      const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], params)
      return value !== undefined ? String(value) : `{${key}}`
    })
  }
}
