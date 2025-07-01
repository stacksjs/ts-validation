import type { DoubleValidator } from '../validators/double'
import type { LengthValidator, Validator } from './base'

export interface DoubleValidatorType extends Validator<number>, LengthValidator<DoubleValidator> {
  positive: () => DoubleValidator
  negative: () => DoubleValidator
  divisibleBy: (divisor: number) => DoubleValidator
  custom: (fn: (value: number | null | undefined) => boolean, message: string) => DoubleValidator
}
