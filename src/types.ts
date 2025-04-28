export interface ValidationConfig {
  verbose: boolean
  strictMode?: boolean
  cacheResults?: boolean
  errorMessages?: Record<string, string>
}

export type ValidationOptions = Partial<ValidationConfig>

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  value?: any
  rule?: string
}

export interface ValidationRule<T = any> {
  validate: (value: T, options?: any) => boolean
  message: string | ((field: string, value: T, options?: any) => string)
  options?: any
}

export type ValidationSchema = Record<string, ValidationRule[]>

export interface BaseValidator<T = any> {
  validate: (value: T) => ValidationResult
  test: (value: T) => boolean
  required: () => Validator<T>
  optional: () => Validator<T>
  rules: Array<{ test: (val: T) => boolean, message: string, options?: any }>
}

export type Validator<T = any> = Omit<BaseValidator<T>, 'rules'>

export type StringValidator = Validator<string> & {
  min: (length: number) => StringValidator
  max: (length: number) => StringValidator
  length: (length: number) => StringValidator
  email: () => StringValidator
  url: () => StringValidator
  matches: (pattern: RegExp) => StringValidator
  alphanumeric: () => StringValidator
  alpha: () => StringValidator
  numeric: () => StringValidator
}

export type NumberValidator = Validator<number> & {
  min: (min: number) => NumberValidator
  max: (max: number) => NumberValidator
  positive: () => NumberValidator
  negative: () => NumberValidator
  integer: () => NumberValidator
}

export type BooleanValidator = Validator<boolean>

export type ArrayValidator<T = any> = Validator<T[]> & {
  min: (length: number) => ArrayValidator<T>
  max: (length: number) => ArrayValidator<T>
  length: (length: number) => ArrayValidator<T>
  each: (validator: Validator<T>) => ArrayValidator<T>
}

export type ObjectValidator<T = Record<string, any>> = Validator<T> & {
  shape: (schema: Record<string, Validator>) => ObjectValidator<T>
  strict: (strict?: boolean) => ObjectValidator<T>
}

export interface ValidationInstance {
  string: () => StringValidator
  number: () => NumberValidator
  boolean: () => BooleanValidator
  array: <T = any>() => ArrayValidator<T>
  object: <T = Record<string, any>>() => ObjectValidator<T>
  custom: <T = any>(validator: (value: T) => boolean, message: string) => Validator<T>
  clearCache: () => void
}
