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

/**
 * Marks a validator that has been through `.required()`.
 *
 * `isRequired` is a runtime boolean and `required()` returned `this`, so
 * nothing distinguished `string()` from `string().required()` at the type
 * level. Anything inferring a shape from a set of rules - a request body, an
 * event payload - therefore typed every field as present, including the ones
 * that are not, which is the type saying something the runtime does not.
 *
 * A phantom property rather than a type parameter, so the 80-odd chainable
 * methods across the concrete validators do not each have to thread a flag.
 * They return `this`, which carries the marker forward: `.required().min(5)`
 * is still required, and so is `.min(5).required()`.
 *
 * Never present at runtime - it exists only for {@link IsRequired} to read.
 *
 * An ordinary property name rather than a `unique symbol`, because a symbol is
 * not nameable from a consumer's declaration emit: an application writing
 * `export const rule = schema.string().required()` under
 * `isolatedDeclarations` got TS4023, "has or is using name 'REQUIRED' ... but
 * cannot be named". A marker that makes correct code stop compiling is worse
 * than the gap it closes.
 */
export interface RequiredMarker {
  readonly __isRequired: true
}

export interface Validator<T> {
  name: ValidationNames
  isRequired: boolean
  getRules: () => ValidationRule<T>[]
  test: (value: T) => boolean
  validate: (value: T) => ValidationResult
  required: () => this & RequiredMarker
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

/**
 * Length constraints, returning `this` rather than a named type parameter.
 *
 * It used to be `LengthValidator<T>` with each method returning `T`, which
 * meant `.required().min(5)` handed back the plain `StringValidatorType` and
 * dropped the {@link REQUIRED} marker - so whether a field read as required
 * depended on where in the chain `.required()` was written. The type parameter
 * is kept, unused, so the dozen `extends LengthValidator<X>` clauses across
 * these files stay as they are.
 */
export interface LengthValidator<_T = unknown> {
  min: (length: number) => this
  max: (length: number) => this
  length: (length: number) => this
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
  'binary' |
  'file'

export type Infer<T> = T extends Validator<infer U> ? U : never

/**
 * Whether a rule has been marked `.required()`.
 *
 * Consumers building a shape out of a rule set use this to decide which keys
 * are optional - see {@link REQUIRED} for why it is a phantom property.
 */
export type IsRequired<T> = T extends RequiredMarker ? true : false
