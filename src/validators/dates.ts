import { BaseValidator } from './base'

export class DateValidator extends BaseValidator<Date> {
  constructor() {
    super()
    this.addRule({
      name: 'date',
      test: (value: unknown): value is Date => value instanceof Date && !Number.isNaN(value.getTime()),
      message: 'Must be a valid date',
    })
  }

  timestamp(): this {
    return this.addRule({
      name: 'timestamp',
      test: (value: Date) => {
        const timestamp = value.getTime()
        return timestamp >= 0 && timestamp <= Number.MAX_SAFE_INTEGER
      },
      message: 'Must be a valid timestamp',
    })
  }

  datetime(): this {
    return this.addRule({
      name: 'datetime',
      test: (value: Date) => {
        const timestamp = value.getTime()
        return timestamp >= 0 && timestamp <= Number.MAX_SAFE_INTEGER
      },
      message: 'Must be a valid datetime',
    })
  }
}

export function date(): DateValidator {
  return new DateValidator()
}
