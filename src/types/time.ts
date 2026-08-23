import type { Validator } from './base'

export interface TimeValidatorType extends Validator<string> {
  min: (min: string) => this
  max: (max: string) => this
  length: (length: number) => this
  custom: (fn: (value: string | null | undefined) => boolean, message: string) => this
}
