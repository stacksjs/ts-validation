import type { ValidationNames } from '../types'
import { BaseValidator } from './base'

export class TimestampTzValidator extends BaseValidator<number | string> {
  public name: ValidationNames = 'timestampTz'

  constructor() {
    super()
    this.addRule({
      name: 'timestampTz',
      test: (value: number | string | null | undefined) => {
        if (value === null || value === undefined) {
          return false
        }

        // For numeric values, validate as Unix timestamp
        if (typeof value === 'number') {
          const num = Number(value)
          if (Number.isNaN(num)) {
            return false
          }

          // MySQL TIMESTAMP range: 1970-01-01 to 2038-01-19
          const minTimestamp = 0 // 1970-01-01 00:00:00 UTC
          const maxTimestamp = 2147483647 // 2038-01-19 03:14:07 UTC

          return num >= minTimestamp && num <= maxTimestamp
        }

        // For string values, check for timezone information
        if (typeof value === 'string') {
          const str = value.trim()

          // Check if it's a numeric string (Unix timestamp)
          const num = Number(str)
          if (!Number.isNaN(num)) {
            // If it's a numeric string, validate as Unix timestamp
            const minTimestamp = 0
            const maxTimestamp = 2147483647

            // Check length (10-13 digits) for Unix timestamps
            if (str.length < 10 || str.length > 13) {
              return false
            }

            return num >= minTimestamp && num <= maxTimestamp
          }

          // Check for ISO 8601 format with timezone
          // Examples: 2023-12-25T10:30:00Z, 2023-12-25T10:30:00+05:00, 2023-12-25T10:30:00-08:00
          const isoWithTzRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/
          if (isoWithTzRegex.test(str)) {
            const date = new Date(str)
            return !Number.isNaN(date.getTime())
          }

          // Check for RFC 3339 format with timezone
          // Examples: 2023-12-25 10:30:00Z, 2023-12-25 10:30:00+05:00
          const rfc3339WithTzRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})$/
          if (rfc3339WithTzRegex.test(str)) {
            const date = new Date(str)
            return !Number.isNaN(date.getTime())
          }

          // Check for other common timezone formats
          // Examples: 2023-12-25T10:30:00.000Z, 2023-12-25 10:30:00 UTC
          const otherTzFormats = [
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/, // ISO with milliseconds
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/, // UTC suffix
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} GMT$/, // GMT suffix
            /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]{3,4}$/, // Timezone abbreviations
          ]

          for (const regex of otherTzFormats) {
            if (regex.test(str)) {
              const date = new Date(str)
              return !Number.isNaN(date.getTime())
            }
          }

          return false
        }

        return false
      },
      message: 'Must be a valid timestamp with timezone information (ISO 8601, RFC 3339, or Unix timestamp)',
    })
  }

  test(value: any): boolean {
    // Override the base test method to handle null/undefined properlyc
    if (value === null || value === undefined) {
      return !this.isRequired
    }

    return this.validate(value).valid
  }
}

export function timestampTz(): TimestampTzValidator {
  return new TimestampTzValidator()
}
