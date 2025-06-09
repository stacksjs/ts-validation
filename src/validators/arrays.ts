import type { ArrayValidatorType, ValidationNames, Validator } from '../types'
import { BaseValidator } from './base'

export class ArrayValidator<T> extends BaseValidator<T[]> implements ArrayValidatorType<T> {
  public name: ValidationNames = 'array'

  constructor() {
    super()
    this.addRule({
      name: 'array',
      test: (value: unknown): value is T[] => Array.isArray(value),
      message: 'Must be an array',
    })
  }

  min(length: number): this {
    return this.addRule({
      name: 'min',
      test: (value: T[]) => value.length >= length,
      message: 'Must have at least {length} items',
      params: { length },
    })
  }

  max(length: number): this {
    return this.addRule({
      name: 'max',
      test: (value: T[]) => value.length <= length,
      message: 'Must have at most {length} items',
      params: { length },
    })
  }

  length(length: number): this {
    return this.addRule({
      name: 'length',
      test: (value: T[]) => value.length === length,
      message: 'Must have exactly {length} items',
      params: { length },
    })
  }

  each(validator: Validator<T>): this {
    return this.addRule({
      name: 'each',
      test: (value: T[]) => value.every(item => validator.test(item)),
      message: 'Each item in array is invalid',
    })
  }

  unique(): this {
    return this.addRule({
      name: 'unique',
      test: (value: T[]) => {
        const seen = new Set()
        return value.every((item) => {
          const key = JSON.stringify(item)
          if (seen.has(key))
            return false
          seen.add(key)
          return true
        })
      },
      message: 'Array must contain unique values',
    })
  }
}

export function array<T>(): ArrayValidator<T> {
  return new ArrayValidator<T>()
}
