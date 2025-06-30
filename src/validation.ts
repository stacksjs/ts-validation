import type { ValidationInstance } from './types'
import { array } from './validators/arrays'
import { bigint } from './validators/bigint'
import { binary } from './validators/binary'
import { blob } from './validators/blob'
import { boolean } from './validators/booleans'
import { custom } from './validators/custom'
import { date } from './validators/dates'
import { datetime } from './validators/datetimes'
import { decimal } from './validators/decimal'
import { enum_ } from './validators/enums'
import { float } from './validators/float'
import { integer } from './validators/integer'
import { json } from './validators/json'
import { number } from './validators/numbers'
import { object } from './validators/objects'
import { password } from './validators/password'
import { smallint } from './validators/smallint'
import { string } from './validators/strings'
import { text } from './validators/text'
import { time } from './validators/time'
import { timestamp } from './validators/timestamps'
import { timestampTz } from './validators/timestamptz'
import { unix } from './validators/unix'

export const v: ValidationInstance = {
  string,
  text,
  number,
  bigint,
  array,
  boolean,
  enum: enum_,
  date,
  datetime,
  object,
  custom,
  timestamp,
  timestampTz,
  unix,
  password,
  float,
  decimal,
  time,
  smallint,
  integer,
  json,
  blob,
  binary,
}
