import type { IsFloatOptions, IsIntOptions, NumberValidatorType } from '../types'
import isDecimal from '../lib/isDecimal'
import isDivisibleBy from '../lib/isDivisibleBy'
import isFloat from '../lib/isFloat'
import isInt from '../lib/isInt'
import { BaseValidator } from './base'

export class NumberValidator extends BaseValidator<number> implements NumberValidatorType {
  public name: string = 'number'

  constructor() {
    super()
    this.addRule({
      name: 'number',
      test: (value: unknown): value is number => typeof value === 'number' && !Number.isNaN(value),
      message: 'Must be a number',
    })
  }

  min(min: number): this {
    return this.addRule({
      name: 'min',
      test: (value: number) => value >= min,
      message: 'Must be at least {min}',
      params: { min },
    })
  }

  max(max: number): this {
    return this.addRule({
      name: 'max',
      test: (value: number) => value <= max,
      message: 'Must be at most {max}',
      params: { max },
    })
  }

  integer(options?: IsIntOptions): this {
    return this.addRule({
      name: 'integer',
      test: (value: number) => isInt(String(value), options ?? {}),
      message: 'Must be an integer',
    })
  }

  float(options?: IsFloatOptions): this {
    return this.addRule({
      name: 'float',
      test: (value: number) => isFloat(String(value), options ?? {}),
      message: 'Must be a float',
    })
  }

  decimal(options?: Parameters<typeof isDecimal>[1]): this {
    return this.addRule({
      name: 'decimal',
      test: (value: number) => isDecimal(String(value), options ?? {}),
      message: 'Must be a decimal number',
    })
  }

  positive(): this {
    return this.addRule({
      name: 'positive',
      test: (value: number) => value > 0,
      message: 'Must be a positive number',
    })
  }

  negative(): this {
    return this.addRule({
      name: 'negative',
      test: (value: number) => value < 0,
      message: 'Must be a negative number',
    })
  }

  divisibleBy(divisor: number): this {
    return this.addRule({
      name: 'divisibleBy',
      test: (value: number) => isDivisibleBy(String(value), divisor),
      message: 'Must be divisible by {divisor}',
      params: { divisor },
    })
  }

  custom(fn: (value: number) => boolean, message: string): this {
    return this.addRule({
      name: 'custom',
      test: fn,
      message,
    })
  }
}

// Export a function to create number validators
export function number(): NumberValidator {
  return new NumberValidator()
}
