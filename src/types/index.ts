import type { ArrayValidatorType } from './array'
import type { Validator } from './base'
import type { BinaryValidatorType } from './binary'
import type { BlobValidatorType } from './blob'
import type { BooleanValidatorType } from './boolean'
import type { CustomValidatorType } from './custom'
import type { DatetimeValidatorType, DateValidatorType } from './date'
import type { DecimalValidatorType } from './decimal'
import type { DoubleValidatorType } from './double'
import type { EnumValidatorType } from './enum'
import type { FloatValidatorType } from './float'
import type { IntegerValidatorType } from './integer'
import type { JsonValidatorType } from './json'
import type { BigintValidatorType, NumberValidatorType } from './number'
import type { ObjectValidatorType } from './object'
import type { PasswordValidatorType } from './password'
import type { SmallintValidatorType } from './smallint'
// Re-export ValidationInstance type
import type { StringValidatorType, TextValidatorType } from './string'
import type { TimeValidatorType } from './time'
import type { TimestampValidatorType, UnixValidatorType } from './timestamp'
import type { TimestampTzValidatorType } from './timestamptz'

export * from './array'

// Base types
export * from './base'
export * from './binary'
export * from './blob'
export * from './boolean'
export * from './custom'
export * from './date'
export * from './decimal'
export * from './double'
export * from './enum'

export * from './float'
export * from './integer'
export * from './json'
export * from './number'
export * from './object'
// Options types
export * from './options'
export * from './password'
export * from './smallint'
// Validator types
export * from './string'
export * from './time'
export * from './timestamp'
export * from './timestamptz'

export interface ValidationInstance {
  string: () => StringValidatorType
  text: () => TextValidatorType
  number: () => NumberValidatorType
  bigint: () => BigintValidatorType
  array: <T>() => ArrayValidatorType<T>
  boolean: () => BooleanValidatorType
  enum: <T extends string | number>(values: readonly T[]) => EnumValidatorType<T>
  date: () => DateValidatorType
  datetime: () => DatetimeValidatorType
  object: <T extends Record<string, any>>(schema?: Record<string, Validator<any>>) => ObjectValidatorType<T>
  custom: <T>(validationFn: (value: T) => boolean, message: string) => CustomValidatorType<T>
  timestamp: () => TimestampValidatorType
  timestampTz: () => TimestampTzValidatorType
  unix: () => UnixValidatorType
  password: () => PasswordValidatorType
  float: () => FloatValidatorType
  double: () => DoubleValidatorType
  decimal: () => DecimalValidatorType
  time: () => TimeValidatorType
  smallint: () => SmallintValidatorType
  integer: () => IntegerValidatorType
  json: () => JsonValidatorType
  blob: () => BlobValidatorType
  binary: () => BinaryValidatorType
}

export type ValidationType = {
  [K in keyof ValidationInstance]: ReturnType<ValidationInstance[K]>
}[keyof ValidationInstance]
