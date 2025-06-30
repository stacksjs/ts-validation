import type { EnumValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class EnumValidator<T extends string | number> extends BaseValidator<T> implements EnumValidatorType<T> {
  public name: ValidationNames = 'enum'

  private allowedValues: readonly T[]

  constructor(allowedValues: readonly T[]) {
    super()
    this.allowedValues = allowedValues
    this.addRule({
      name: 'enum',
      test: (value: T) => this.allowedValues.includes(value),
      message: 'Must be one of: {values}',
      params: { values: this.allowedValues.join(', ') },
    })
  }

  getAllowedValues(): readonly T[] {
    return this.allowedValues
  }

  custom(fn: (value: T) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

export function enum_<T extends string | number>(allowedValues: readonly T[]): EnumValidator<T> {
  return new EnumValidator(allowedValues)
}
