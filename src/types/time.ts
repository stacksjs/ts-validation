import type { TimeValidator } from '../validators/time'
import type { Validator } from './base'

export interface TimeValidatorType extends Validator<string> {
  min: (min: string) => TimeValidator
  max: (max: string) => TimeValidator
  length: (length: number) => TimeValidator
  custom: (fn: (value: string) => boolean, message: string) => TimeValidator
}
