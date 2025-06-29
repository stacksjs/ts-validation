import type { IsAfterOptions } from '../types/date'
import toDate from './toDate'

/**
 * Check if the string is After
 *
 * @param date - Options object
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isAfter(date: string, options: IsAfterOptions): boolean {
  // For backwards compatibility:
  // isAfter(str [, date]), i.e. `options` could be used as argument for the legacy `date`
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : options) || String(new Date()).toString()

  const comparison = toDate(comparisonDate)
  const original = toDate(date)

  return !!(original && comparison && original > comparison)
}
