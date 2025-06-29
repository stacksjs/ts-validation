import type { PasswordValidator } from '../validators/password'
import type { LengthValidator, Validator } from './base'

export interface PasswordAnalysis {
  length: number
  uniqueChars: number
  uppercaseCount: number
  lowercaseCount: number
  numberCount: number
  symbolCount: number
}

export interface PasswordValidatorType extends Validator<string>, LengthValidator<PasswordValidator> {
  matches: (confirmPassword: string) => PasswordValidator
  hasUppercase: () => PasswordValidator
  hasLowercase: () => PasswordValidator
  hasNumbers: () => PasswordValidator
  hasSpecialCharacters: () => PasswordValidator
  alphanumeric: () => PasswordValidator
}
