import type { BooleanValidatorType } from '../types'
import { BaseValidator } from './base'

export class BooleanValidator extends BaseValidator<boolean> implements BooleanValidatorType {
  constructor() {
    super()
    this.addRule({
      name: 'boolean',
      test: (value: unknown): value is boolean => typeof value === 'boolean',
      message: 'Must be a boolean',
    })
  }

  isTrue(): this {
    return this.addRule({
      name: 'isTrue',
      test: (value: boolean) => value === true,
      message: 'Must be true',
    })
  }

  isFalse(): this {
    return this.addRule({
      name: 'isFalse',
      test: (value: boolean) => value === false,
      message: 'Must be false',
    })
  }

  custom(fn: (value: boolean) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

export function boolean(): BooleanValidator {
  return new BooleanValidator()
}
