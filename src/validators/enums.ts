import type { EnumValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class EnumValidator extends BaseValidator<string> implements EnumValidatorType {
  public name: ValidationNames = 'enum'

  private allowedValues: readonly string[]

  constructor(allowedValues: readonly string[]) {
    super()
    this.allowedValues = allowedValues
    this.addRule({
      name: 'enum',
      test: (value: string) => this.allowedValues.includes(value),
      message: 'Must be one of: {values}',
      params: { values: this.allowedValues.join(', ') },
    })
  }

  getAllowedValues(): readonly string[] {
    return this.allowedValues
  }

  custom(fn: (value: string) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

export function enum_(allowedValues: readonly string[]): EnumValidator {
  return new EnumValidator(allowedValues)
}
