import type { Validator } from './base'

export interface EnumValidatorType<T extends string = string> extends Validator<T> {
  readonly name: 'enum'
  getAllowedValues: () => readonly T[]
  custom: (fn: (value: T) => boolean, message: string) => EnumValidatorType<T>
}
