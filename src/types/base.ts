// Define unique symbols for schema properties
export const SCHEMA_NAME: unique symbol = Symbol('schema_name')
export const INPUT_TYPE: unique symbol = Symbol('input_type')
export const OUTPUT_TYPE: unique symbol = Symbol('output_type')
export const COMPUTED_TYPE: unique symbol = Symbol('computed_type')
export const PARSE: unique symbol = Symbol('parse')

export interface ValidationError {
  message: string
}

export interface ValidationErrorMap {
  [field: string]: ValidationError[]
}

export type ValidationErrors = ValidationError[] | ValidationErrorMap

export interface ValidationResult {
  valid: boolean
  errors: ValidationErrors
}

export interface ValidationRule<T> {
  name: string
  test: (value: T) => boolean
  message: string
  params?: Record<string, any>
}

export interface Validator<T> {
  name: ValidationNames
  isRequired: boolean
  getRules: () => ValidationRule<T>[]
  test: (value: T) => boolean
  validate: (value: T | undefined | null) => ValidationResult
  required: () => this
  optional: () => this
}

// Internal interface for implementation details
export interface ValidatorInternal<T> extends Validator<T> {
  isPartOfShape: boolean
  rules: ValidationRule<T>[]
}

export interface ValidationConfig {
  verbose: boolean
  strictMode?: boolean
  cacheResults?: boolean
  errorMessages?: Record<string, string>
}

export interface LengthValidator<T> {
  min: (length: number) => T
  max: (length: number) => T
  length: (length: number) => T
}

export type ValidationNames = 'base' |
  'string' |
  'number' |
  'array' |
  'boolean' |
  'enum' |
  'date' |
  'datetime' |
  'object' |
  'custom' |
  'timestamp' |
  'unix' |
  'password' |
  'text' |
  'bigint' |
  'timestampTz' |
  'float' |
  'decimal' |
  'time' |
  'smallint' |
  'integer' |
  'json' |
  'blob' |
  'binary'

export type Infer<T> = T extends Validator<infer U> ? U : never
