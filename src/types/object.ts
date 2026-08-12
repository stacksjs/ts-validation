import type { Validator } from './base'

export type ValidatorShape = Readonly<Record<string, Validator<any>>>

export type InferShape<TSchema extends ValidatorShape> = {
  -readonly [K in keyof TSchema]: TSchema[K] extends Validator<infer TValue> ? TValue : never
}

export interface ObjectValidatorType<T extends Record<string, unknown>> extends Validator<T> {
  shape: <const TSchema extends ValidatorShape>(schema: TSchema) => ObjectValidatorType<InferShape<TSchema>>
  strict: (strict?: boolean) => ObjectValidatorType<T>
}
