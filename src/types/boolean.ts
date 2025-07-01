import type { Validator } from './base'

export interface IsBooleanOptions {
  loose?: boolean
}

export interface BooleanValidatorType extends Validator<boolean> {
  isTrue: () => BooleanValidatorType
  isFalse: () => BooleanValidatorType
  custom: (fn: (value: boolean) => boolean, message: string) => BooleanValidatorType
}
