import type { Validator } from './base'

export interface IsBooleanOptions {
  loose?: boolean
}

export interface BooleanValidatorType extends Validator<boolean> {
  isTrue: () => this
  isFalse: () => this
  custom: (fn: (value: boolean) => boolean, message: string) => this
}
