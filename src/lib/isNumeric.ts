import { decimal } from './locales/decimal'
import assertString from './util/assertString'

export interface NumericOptions {
  no_symbols?: boolean
  locale?: string
}

const numericNoSymbols = /^\d+$/

/**
 * Check if the string contains only numbers.
 *
 * @param str - The string to check
 * @param options - Optional parameters to control validation behavior
 * @returns True if the string contains only numbers, false otherwise
 */
export default function isNumeric(str: string, options?: NumericOptions): boolean {
  assertString(str)

  if (options?.no_symbols) {
    return numericNoSymbols.test(str)
  }

  const decimalChar = options?.locale
    ? (decimal[options.locale] || '.')
    : '.'

  return (new RegExp(`^[+-]?([0-9]*[${decimalChar}])?[0-9]+$`)).test(str)
}
