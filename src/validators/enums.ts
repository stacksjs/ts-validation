import { BaseValidator } from './base'

export class EnumValidator<T extends string | number> extends BaseValidator<T> {
  private allowedValues: readonly T[]

  constructor(allowedValues: readonly T[]) {
    super()
    this.allowedValues = allowedValues
    this.addRule({
      name: 'enum',
      test: (value: unknown): value is T => this.allowedValues.includes(value as T),
      message: 'Must be one of: {values}',
      params: { values: this.allowedValues.join(', ') },
    })
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
