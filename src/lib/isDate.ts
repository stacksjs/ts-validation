import type { DateObj, DateOptions } from '../types'
import merge from './util/merge'

const default_date_options = {
  format: 'YYYY/MM/DD',
  delimiters: ['/', '-'],
  strictMode: false,
}

function isValidFormat(format: string): boolean {
  return /^(?:y{4}|y{2})[./-]m{1,2}[./-]d{1,2}$|^m{1,2}[./-]d{1,2}[./-](?:y{4}|y{2})$|^d{1,2}[./-]m{1,2}[./-](?:y{4}|y{2})$/i.test(format)
}

function zip(date: string[], format: string[]): [string, string][] {
  const zippedArr: [string, string][] = []
  const len = Math.max(date.length, format.length)

  for (let i = 0; i < len; i++) {
    zippedArr.push([date[i], format[i]])
  }

  return zippedArr
}

/**
 * Check if the string is Date
 *
 * @param input - Options object
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isDate(input: string | Date, options: string | DateOptions): boolean {
  let mergedOptions: DateOptions

  if (typeof options === 'string') {
    mergedOptions = merge({ format: options }, default_date_options) as DateOptions
  }
  else {
    mergedOptions = merge(options, default_date_options) as DateOptions
  }

  if (typeof input === 'string' && isValidFormat(mergedOptions.format)) {
    if (mergedOptions.strictMode && input.length !== mergedOptions.format.length)
      return false
    const formatDelimiter = mergedOptions.delimiters
      .find(delimiter => mergedOptions.format.includes(delimiter))
    const dateDelimiter = mergedOptions.strictMode
      ? formatDelimiter
      : mergedOptions.delimiters.find(delimiter => input.includes(delimiter))
    const dateAndFormat = zip(
      input.split(dateDelimiter!),
      mergedOptions.format.toLowerCase().split(formatDelimiter!),
    )
    const dateObj: DateObj = {} as DateObj

    for (const [dateWord, formatWord] of dateAndFormat) {
      if (!dateWord || !formatWord || dateWord.length !== formatWord.length) {
        return false
      }

      dateObj[formatWord.charAt(0) as keyof DateObj] = dateWord
    }

    let fullYear = dateObj.y

    // Check if the year starts with a hyphen
    if (fullYear.startsWith('-')) {
      return false // Hyphen before year is not allowed
    }

    if (dateObj.y.length === 2) {
      const parsedYear = Number.parseInt(dateObj.y, 10)

      if (Number.isNaN(parsedYear)) {
        return false
      }

      const currentYearLastTwoDigits = new Date().getFullYear() % 100

      if (parsedYear < currentYearLastTwoDigits) {
        fullYear = `20${dateObj.y}`
      }
      else {
        fullYear = `19${dateObj.y}`
      }
    }

    let month = dateObj.m

    if (dateObj.m.length === 1) {
      month = `0${dateObj.m}`
    }

    let day = dateObj.d

    if (dateObj.d.length === 1) {
      day = `0${dateObj.d}`
    }

    return new Date(`${fullYear}-${month}-${day}T00:00:00.000Z`).getUTCDate() === +dateObj.d
  }

  if (!mergedOptions.strictMode) {
    return Object.prototype.toString.call(input) === '[object Date]' && Number.isFinite(input)
  }

  return false
}
