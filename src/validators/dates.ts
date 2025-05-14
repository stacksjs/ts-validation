import { BaseValidator } from './base'

export class DateValidator extends BaseValidator<Date> {
  constructor() {
    super()
    this.addRule({
      name: 'date',
      test: (value: unknown): value is Date => value instanceof Date && !isNaN(value.getTime()),
      message: 'Must be a valid date',
    })
  }

  min(date: Date): this {
    return this.addRule({
      name: 'min',
      test: (value: Date) => value.getTime() >= date.getTime(),
      message: 'Must be on or after {date}',
      params: { date: date.toISOString() },
    })
  }

  max(date: Date): this {
    return this.addRule({
      name: 'max',
      test: (value: Date) => value.getTime() <= date.getTime(),
      message: 'Must be on or before {date}',
      params: { date: date.toISOString() },
    })
  }

  between(start: Date, end: Date): this {
    return this.addRule({
      name: 'between',
      test: (value: Date) => {
        const time = value.getTime()
        return time >= start.getTime() && time <= end.getTime()
      },
      message: 'Must be between {start} and {end}',
      params: { start: start.toISOString(), end: end.toISOString() },
    })
  }

  isBefore(date: Date): this {
    return this.addRule({
      name: 'isBefore',
      test: (value: Date) => value.getTime() < date.getTime(),
      message: 'Must be before {date}',
      params: { date: date.toISOString() },
    })
  }

  isAfter(date: Date): this {
    return this.addRule({
      name: 'isAfter',
      test: (value: Date) => value.getTime() > date.getTime(),
      message: 'Must be after {date}',
      params: { date: date.toISOString() },
    })
  }

  isToday(): this {
    return this.addRule({
      name: 'isToday',
      test: (value: Date) => {
        const today = new Date()
        return (
          value.getDate() === today.getDate()
          && value.getMonth() === today.getMonth()
          && value.getFullYear() === today.getFullYear()
        )
      },
      message: 'Must be today',
    })
  }

  isWeekend(): this {
    return this.addRule({
      name: 'isWeekend',
      test: (value: Date) => {
        const day = value.getDay()
        return day === 0 || day === 6
      },
      message: 'Must be a weekend day',
    })
  }

  isWeekday(): this {
    return this.addRule({
      name: 'isWeekday',
      test: (value: Date) => {
        const day = value.getDay()
        return day !== 0 && day !== 6
      },
      message: 'Must be a weekday',
    })
  }

  custom(fn: (value: Date) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

export function date(): DateValidator {
  return new DateValidator()
}
