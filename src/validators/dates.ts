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
}

export function date(): DateValidator {
  return new DateValidator()
}
