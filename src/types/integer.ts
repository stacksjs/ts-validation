import type { IntegerValidator } from '../validators/integer'
import type { NumberValidatorType } from './number'

export interface IntegerValidatorType extends NumberValidatorType {
  // IntegerValidator inherits all methods from NumberValidatorType
  // but ensures the value is an integer
}
