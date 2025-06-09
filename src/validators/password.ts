import type { PasswordValidatorType, ValidationNames } from '../types'
import { BaseValidator } from './base'

export class PasswordValidator extends BaseValidator<string> implements PasswordValidatorType {
  public name: ValidationNames = 'password'

  constructor() {
    super()
    this.addRule({
      name: 'string',
      test: (value: unknown): value is string => typeof value === 'string',
      message: 'Must be a string',
    })
  }

  matches(confirmPassword: string): this {
    return this.addRule({
      name: 'matches',
      test: (value: string) => value === confirmPassword,
      message: 'Passwords must match',
    })
  }

  min(length: number = 8): this {
    return this.addRule({
      name: 'minLength',
      test: (value: string) => value.length >= length,
      message: 'Password must be at least {length} characters long',
      params: { length },
    })
  }

  max(length: number = 128): this {
    return this.addRule({
      name: 'maxLength',
      test: (value: string) => value.length <= length,
      message: 'Password must be at most {length} characters long',
      params: { length },
    })
  }

  hasUppercase(): this {
    return this.addRule({
      name: 'hasUppercase',
      test: (value: string) => /[A-Z]/.test(value),
      message: 'Password must contain at least one uppercase letter',
    })
  }

  hasLowercase(): this {
    return this.addRule({
      name: 'hasLowercase',
      test: (value: string) => /[a-z]/.test(value),
      message: 'Password must contain at least one lowercase letter',
    })
  }

  hasNumbers(): this {
    return this.addRule({
      name: 'hasNumbers',
      test: (value: string) => /[0-9]/.test(value),
      message: 'Password must contain at least one number',
    })
  }

  hasSpecialCharacters(): this {
    return this.addRule({
      name: 'hasSpecialCharacters',
      test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      message: 'Password must contain at least one special character',
    })
  }

  alphanumeric(): this {
    return this.addRule({
      name: 'alphanumeric',
      test: (value: string) => /(?=.*[a-z])(?=.*\d)/i.test(value),
      message: 'Password must contain both letters and numbers',
    })
  }
}

export function password(): PasswordValidator {
  return new PasswordValidator()
}
