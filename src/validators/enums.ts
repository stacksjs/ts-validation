import type { EnumValidatorType } from '../types'
import { BaseValidator } from './base'

export class EnumValidator<T extends string = string> extends BaseValidator<T> implements EnumValidatorType<T> {
  /*
   * Annotated rather than inferred from `'enum' as const`.
   *
   * The declaration emitter widened the inferred form to `unknown` - the base
   * class declares `name: ValidationNames` and a `readonly` narrowing of it is
   * more than it could describe - so the published type said an EnumValidator
   * has a `name` of `unknown`, and nothing that asks for `EnumValidatorType`
   * accepted one. Downstream that reads as `schema.enum([...])` not being an
   * enum validator, which is a confusing way to be told about a `.d.ts` bug.
   */
  public readonly name: 'enum' = 'enum'

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
