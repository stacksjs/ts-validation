import type { ValidationError, ValidationErrorMap, ValidationNames, ValidationResult, ValidationRule, Validator } from '../types'
import { getMessagesProvider } from '../messages'

export abstract class BaseValidator<T> implements Validator<T> {
  protected rules: ValidationRule<T>[] = []
  public isRequired = false
  protected fieldName = 'value'
  protected isPartOfShape = false
  public name: ValidationNames = 'base'

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

  setFieldName(fieldName: string): this {
    this.fieldName = fieldName
    return this
  }

  protected addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule)
    return this
  }

  validate(value: T): ValidationResult {
    const errors: ValidationError[] = []

    if (!this.isRequired && (value === undefined || value === null || value === '')) {
      return this.isPartOfShape
        ? { valid: true, errors: {} }
        : { valid: true, errors: [] }
    }

    if (this.isRequired && (value === undefined || value === null || value === '')) {
      const messagesProvider = getMessagesProvider()
      const message = messagesProvider.getMessage('required', this.fieldName)
      const error = { message }
      return this.isPartOfShape
        ? { valid: false, errors: { [this.fieldName]: [error] } }
        : { valid: false, errors: [error] }
    }

    for (const rule of this.rules) {
      if (!rule.test(value)) {
        const messagesProvider = getMessagesProvider()
        const message = messagesProvider.getMessage(rule.name, this.fieldName, rule.params)
        errors.push({ message })
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

  getRules(): ValidationRule<T>[] {
    return this.rules
  }

  test(value: T): boolean {
    return this.validate(value).valid
  }
}
