import type { ValidationConfig } from './types'
import { loadConfig } from 'bunfig'

export const defaultConfig: ValidationConfig = {
  verbose: true,
  strictMode: false,
  cacheResults: true,
  errorMessages: {
    required: '{field} is required',
    string: '{field} must be a string',
    number: '{field} must be a number',
    boolean: '{field} must be a boolean',
    array: '{field} must be an array',
    object: '{field} must be an object',
    email: '{field} must be a valid email',
    url: '{field} must be a valid URL',
    min: '{field} must be at least {min}',
    max: '{field} must be at most {max}',
    length: '{field} must be exactly {length}',
    matches: '{field} is not in the correct format',
    alphanumeric: '{field} must contain only letters and numbers',
    alpha: '{field} must contain only letters',
    numeric: '{field} must contain only numbers',
    integer: '{field} must be an integer',
    positive: '{field} must be positive',
    negative: '{field} must be negative',
  },
}

// eslint-disable-next-line antfu/no-top-level-await
export const config: ValidationConfig = await loadConfig({
  name: 'validation',
  defaultConfig,
})
