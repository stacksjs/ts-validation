import toDate from './toDate'

export interface IsBeforeOptions {
  comparisonDate?: boolean | string
}


/**
 * Check if the string is Before
 *
 * @param date - Options object
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isBefore(date, options): boolean {
  // For backwards compatibility:
  // isBefore(str [, date]), i.e. `options` could be used as argument for the legacy `date`
  const comparisonDate = (typeof options === 'object' ? options.comparisonDate : options) || String(new Date()).toString()

  const comparison = toDate(comparisonDate)
  const original = toDate(date)

  return !!(original && comparison && original < comparison)
}
