import type { Validator } from './base'

export interface TimeValidatorType extends Validator<string> {
  min: (min: string) => TimeValidatorType
  max: (max: string) => TimeValidatorType
  length: (length: number) => TimeValidatorType
  custom: (fn: (value: string | null | undefined) => boolean, message: string) => TimeValidatorType
}
