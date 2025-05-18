import type { ValidationInstance } from './types'
import { array } from './validators/arrays'
import { boolean } from './validators/booleans'
import { custom } from './validators/custom'
import { date } from './validators/dates'
import { enum_ } from './validators/enums'
import { number } from './validators/numbers'
import { object } from './validators/objects'
import { string } from './validators/strings'
import { timestamp } from './validators/timestamp'

export const v: ValidationInstance = {
  string,
  number,
  array,
  boolean,
  enum: enum_,
  date,
  object,
  custom,
  timestamp,
}
