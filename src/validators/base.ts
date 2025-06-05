import type { ValidationError, ValidationErrorMap, ValidationResult, ValidationRule } from '../types'

export abstract class BaseValidator<T> {
  protected rules: ValidationRule<T>[] = []
  protected isRequired = true
  protected fieldName = 'value'
  protected isPartOfShape = false

  required(): this {
    this.isRequired = true
    return this
  }

  optional(): this {
    this.isRequired = false
    return this
  }

  setIsPartOfShape(isPartOfShape: boolean): this {
    this.isPartOfShape = isPartOfShape
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
        return this.isPartOfShape
          ? { valid: true, errors: {} }
          : { valid: true, errors: [] }
      }
      else {
        const error = { message: 'This field is required' }
        return this.isPartOfShape
          ? { valid: false, errors: { [this.fieldName]: [error] } }
          : { valid: false, errors: [error] }
      }
    }

    for (const rule of this.rules) {
      if (!rule.test(value)) {
        errors.push({
          message: this.formatMessage(rule.message, rule.params ?? {}),
        })
      }
    }

    if (this.isPartOfShape && errors.length > 0) {
      const errorMap: ValidationErrorMap = {
        [this.fieldName]: errors,
      }
      return { valid: false, errors: errorMap }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
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
