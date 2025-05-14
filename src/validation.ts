import type { ArrayValidator } from './validators/arrays'
import type { BooleanValidator } from './validators/booleans'
import type { DateValidator } from './validators/dates'
import type { EnumValidator } from './validators/enums'
import type { NumberValidator } from './validators/numbers'
import type { StringValidator } from './validators/strings'

import { array } from './validators/arrays'
import { boolean } from './validators/booleans'
import { date } from './validators/dates'
import { enum_ } from './validators/enums'
import { number } from './validators/numbers'
import { string } from './validators/strings'

interface Validator {
  string: () => StringValidator
  number: () => NumberValidator
  array: <T>() => ArrayValidator<T>
  boolean: () => BooleanValidator
  enum: <T extends string | number>(values: readonly T[]) => EnumValidator<T>
  date: () => DateValidator
}

export const v: Validator = {
  string,
  number,
  array,
  boolean,
  enum: enum_,
  date,
}
