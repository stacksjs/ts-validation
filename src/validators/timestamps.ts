import type { TimestampValidatorType } from '../types'
import { BaseValidator } from './base'

export class TimestampValidator extends BaseValidator<number | string> implements TimestampValidatorType {
  public name: string = 'timestamp'

  constructor() {
    super()
    this.addRule({
      name: 'timestamp',
      test: (value: number | string) => {
        // Check if it's a valid number
        const num = Number(value)
        if (Number.isNaN(num)) {
          return false
        }

        // MySQL TIMESTAMP range: 1970-01-01 to 2038-01-19
        const minTimestamp = 0 // 1970-01-01 00:00:00 UTC
        const maxTimestamp = 2147483647 // 2038-01-19 03:14:07 UTC

        // First check if it's within the valid range
        if (num < minTimestamp || num > maxTimestamp) {
          return false
        }

        // For string inputs, check if the length is valid (10-13 digits)
        if (typeof value === 'string') {
          const timestampStr = value.toString()
          const length = timestampStr.length
          if (length < 10 || length > 13) {
            return false
          }
        }

        return true
      },
      message: 'Must be a valid timestamp between 1970-01-01 and 2038-01-19',
    })
  }
}

export function timestamp(): TimestampValidator {
  return new TimestampValidator()
}
