import type { EnumValidator } from '../validators/enums'
import type { Validator } from './base'

export interface EnumValidatorType<T extends string | number> extends Validator<T> {
  getAllowedValues: () => readonly T[]
  custom: (fn: (value: T) => boolean, message: string) => EnumValidator<T>
}
