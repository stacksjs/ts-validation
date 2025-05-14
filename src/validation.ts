import type { ArrayValidator } from './validators/arrays'
import type { BooleanValidator } from './validators/booleans'
import type { CustomValidator } from './validators/custom'
import type { DateValidator } from './validators/dates'
import type { EnumValidator } from './validators/enums'
import type { NumberValidator } from './validators/numbers'
import type { ObjectValidator } from './validators/objects'
import type { StringValidator } from './validators/strings'

import { array } from './validators/arrays'
import { boolean } from './validators/booleans'
import { custom } from './validators/custom'
import { date } from './validators/dates'
import { enum_ } from './validators/enums'
import { number } from './validators/numbers'
import { object } from './validators/objects'
import { string } from './validators/strings'

interface Validator {
  string: () => StringValidator
  number: () => NumberValidator
  array: <T>() => ArrayValidator<T>
  boolean: () => BooleanValidator
  enum: <T extends string | number>(values: readonly T[]) => EnumValidator<T>
  date: () => DateValidator
  object: <T extends Record<string, any>>() => ObjectValidator<T>
  custom: <T>(validationFn: (value: T) => boolean, message: string) => CustomValidator<T>
}

export const v: Validator = {
  string,
  number,
  array,
  boolean,
  enum: enum_,
  date,
  object,
  custom,
}
