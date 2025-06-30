import type { StringValidatorType, ValidationNames } from '../types'
import isAlpha from '../lib/isAlpha'
import isAlphanumeric from '../lib/isAlphanumeric'
import isEmail from '../lib/isEmail'
import isNumeric from '../lib/isNumeric'
import isURL from '../lib/isURL'
import { BaseValidator } from './base'

export class StringValidator extends BaseValidator<string> implements StringValidatorType {
  public name: ValidationNames = 'string'

  constructor() {
    super()
    this.addRule({
      name: 'string',
      test: (value: string | null | undefined): value is string => typeof value === 'string',
      message: 'Must be a string',
    })
  }

  min(length: number): this {
    return this.addRule({
      name: 'min',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length >= length
      },
      message: 'Must be at least {length} characters long',
      params: { length },
    })
  }

  max(length: number): this {
    return this.addRule({
      name: 'max',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value.length <= length
      },
      message: 'Must be at most {length} characters long',
      params: { length },
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
      message: 'Must be exactly {length} characters long',
      params: { length },
    })
  }

  email(options?: Parameters<typeof isEmail>[1]): this {
    return this.addRule({
      name: 'email',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return isEmail(value, options)
      },
      message: 'Must be a valid email address',
    })
  }

  url(options?: Parameters<typeof isURL>[1]): this {
    return this.addRule({
      name: 'url',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return isURL(value, options)
      },
      message: 'Must be a valid URL',
    })
  }

  matches(pattern: RegExp): this {
    return this.addRule({
      name: 'matches',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return pattern.test(value)
      },
      message: 'Must match pattern {pattern}',
      params: { pattern: pattern.toString() },
    })
  }

  equals(param: string): this {
    return this.addRule({
      name: 'equals',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return value === param
      },
      message: 'Must be equal to {param}',
      params: { param },
    })
  }

  alphanumeric(): this {
    return this.addRule({
      name: 'alphanumeric',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return isAlphanumeric(value)
      },
      message: 'Must only contain letters and numbers',
    })
  }

  alpha(): this {
    return this.addRule({
      name: 'alpha',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return isAlpha(value)
      },
      message: 'Must only contain letters',
    })
  }

  numeric(): this {
    return this.addRule({
      name: 'numeric',
      test: (value: string | null | undefined) => {
        if (typeof value !== 'string')
          return false
        return isNumeric(value)
      },
      message: 'Must only contain numbers',
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

export function string(): StringValidator {
  return new StringValidator()
}
