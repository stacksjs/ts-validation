import type { EnumValidatorType } from '../types'
import { BaseValidator } from './base'

export class EnumValidator<T extends string = string> extends BaseValidator<T> implements EnumValidatorType<T> {
  public readonly name = 'enum' as const

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

export function enum_<const TValues extends readonly string[]>(allowedValues: TValues): EnumValidator<TValues[number]> {
  return new EnumValidator<TValues[number]>(allowedValues)
}
