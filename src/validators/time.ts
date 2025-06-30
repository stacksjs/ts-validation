import type { TimeValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class TimeValidator extends BaseValidator<string> implements TimeValidatorType {
  public name: ValidationNames = 'time'

  constructor() {
    super()
    this.addRule({
      name: 'time',
      test: (value: string | null | undefined): value is string => {
        // First check if it's a string
        if (typeof value !== 'string') {
          return false
        }

        // Check if it's empty
        if (value.trim() === '' || value === undefined || value === null) {
          return false
        }

        // Default to 24-hour format
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/
        return timeRegex.test(value)
      },

      message: 'Must be a valid time format',
    })
  }

  min(min: string): this {
    return this.addRule({
      name: 'min',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number)
          return hours * 60 + minutes
        }
        return timeToMinutes(value) >= timeToMinutes(min)
      },
      message: 'Must be at least {min}',
      params: { min },
    })
  }

  max(max: string): this {
    return this.addRule({
      name: 'max',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        const timeToMinutes = (time: string) => {
          const [hours, minutes] = time.split(':').map(Number)
          return hours * 60 + minutes
        }
        return timeToMinutes(value) <= timeToMinutes(max)
      },
      message: 'Must be at most {max}',
      params: { max },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length === length
      },
      message: 'Must be exactly {length} characters',
      params: { length },
    })
  }

  custom(fn: (value: string | null | undefined) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create time validators
export function time(): TimeValidator {
  return new TimeValidator()
}
