import { BaseValidator } from './base'

export class TimestampValidator extends BaseValidator<number | string> {
  constructor() {
    super()
    this.addRule({
      name: 'timestamp',
      test: (value: number | string) => {
        const timestampStr = value.toString()
        const length = timestampStr.length

        // Check if length is between 10 and 13
        if (length < 10 || length > 13) {
          return false
        }

        // Check if it's a valid number
        const num = Number(value)
        if (Number.isNaN(num)) {
          return false
        }

        // Additional validation: should be a positive number
        return num > 0
      },
      message: 'Must be a valid timestamp (10-13 digits)',
    })
  }
}

export function timestamp(): TimestampValidator {
  return new TimestampValidator()
}
