import type { UnixValidatorType } from '../types'
import { BaseValidator } from './base'

export class UnixValidator extends BaseValidator<number | string> implements UnixValidatorType {
  constructor() {
    super()
    this.addRule({
      name: 'unix',
      test: (value: number | string) => {
        // Check if it's a valid number
        const num = Number(value)
        if (Number.isNaN(num)) {
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

        // Unix timestamp must be a positive number
        return num >= 0
      },
      message: 'Must be a valid Unix timestamp (10-13 digits)',
    })
  }
}

export function unix(): UnixValidator {
  return new UnixValidator()
}
