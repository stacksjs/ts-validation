import type { Validator } from './base'

export interface ObjectValidatorType<T extends Record<string, any>> extends Validator<T> {
  shape: (schema: Record<string, Validator<any>>) => ObjectValidatorType<T>
  strict: (strict?: boolean) => ObjectValidatorType<T>
}
