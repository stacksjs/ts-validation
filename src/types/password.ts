import type { LengthValidator, Validator } from './base'

export interface PasswordAnalysis {
  length: number
  uniqueChars: number
  uppercaseCount: number
  lowercaseCount: number
  numberCount: number
  symbolCount: number
}

export interface PasswordValidatorType extends Validator<string>, LengthValidator<PasswordValidatorType> {
  matches: (confirmPassword: string) => PasswordValidatorType
  hasUppercase: () => PasswordValidatorType
  hasLowercase: () => PasswordValidatorType
  hasNumbers: () => PasswordValidatorType
  hasSpecialCharacters: () => PasswordValidatorType
  alphanumeric: () => PasswordValidatorType
}
