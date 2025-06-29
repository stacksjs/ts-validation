import type { Validator } from './base'

export interface TimestampValidatorType extends Validator<number | string> {
  // Timestamp validator is simple, just implements the base Validator interface
}

export interface UnixValidatorType extends Validator<number | string> {
  // Unix validator is simple, just implements the base Validator interface
}
