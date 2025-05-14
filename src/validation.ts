import type { ArrayValidator } from './validators/arrays'
import type { BooleanValidator } from './validators/booleans'
import type { NumberValidator } from './validators/numbers'
import type { StringValidator } from './validators/strings'

import { array } from './validators/arrays'
import { boolean } from './validators/booleans'
import { number } from './validators/numbers'
import { string } from './validators/strings'

interface Validator {
  string: () => StringValidator
  number: () => NumberValidator
  array: <T>() => ArrayValidator<T>
  boolean: () => BooleanValidator
}

export const v: Validator = {
  string,
  number,
  array,
  boolean,
}
