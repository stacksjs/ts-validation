import type { ValidationInstance } from './types'
import { array } from './validators/arrays'
import { boolean } from './validators/booleans'
import { custom } from './validators/custom'
import { date } from './validators/dates'
import { datetime } from './validators/datetimes'
import { enum_ } from './validators/enums'
import { number } from './validators/numbers'
import { object } from './validators/objects'
import { password } from './validators/password'
import { string } from './validators/strings'
import { timestamp } from './validators/timestamps'
import { unix } from './validators/unix'

export const v: ValidationInstance = {
  string,
  number,
  array,
  boolean,
  enum: enum_,
  date,
  datetime,
  object,
  custom,
  timestamp,
  unix,
  password,
}
