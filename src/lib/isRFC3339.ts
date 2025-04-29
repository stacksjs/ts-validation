import assertString from './util/assertString'

/* Based on https://tools.ietf.org/html/rfc3339#section-5.6 */

const dateFullYear = /\d{4}/
const dateMonth = /(0[1-9]|1[0-2])/
const dateMDay = /([12]\d|0[1-9]|3[01])/

const timeHour = /([01]\d|2[0-3])/
const timeMinute = /[0-5]\d/
const timeSecond = /([0-5]\d|60)/

const timeSecFrac = /(\.\d+)?/
const timeNumOffset = new RegExp(`[-+]${timeHour.source}:${timeMinute.source}`)
const timeOffset = new RegExp(`([zZ]|${timeNumOffset.source})`)

const partialTime = new RegExp(`${timeHour.source}:${timeMinute.source}:${timeSecond.source}${timeSecFrac.source}`)

const fullDate = new RegExp(`${dateFullYear.source}-${dateMonth.source}-${dateMDay.source}`)
const fullTime = new RegExp(`${partialTime.source}${timeOffset.source}`)

const rfc3339 = new RegExp(`^${fullDate.source}[ tT]${fullTime.source}$`)

/**
 * Check if the string is RFC3339
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isRFC3339(str: string): boolean {
  assertString(str)
  return rfc3339.test(str)
}
