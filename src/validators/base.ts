import type { ValidationError, ValidationResult, ValidationRule } from '../types'

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
    const errors: ValidationError[] = []

    if ((value === undefined || value === null)) {
      if (!this.isRequired) {
        return { valid: true, errors: [] }
      }
      else {
        return {
          valid: false,
          errors: [{ message: 'This field is required', value }],
        }
      }
    }

    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push({
          message: this.formatMessage(rule.message, rule.params ?? {}),
          value,
        })
      }
    }

    return { valid: errors.length === 0, errors }
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
