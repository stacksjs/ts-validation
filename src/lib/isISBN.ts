import assertString from './util/assertString'

export interface IsISBNOptions {
  version?: string | number
}

const possibleIsbn10 = /^(?:\d{9}X|\d{10})$/
const possibleIsbn13 = /^\d{13}$/
const factor = [1, 3]

/**
 * Check if the string is a valid ISBN (International Standard Book Number)
 *
 * @param isbn - The string to check
 * @param options - Options object that specifies ISBN version to validate against
 * @returns True if the string is a valid ISBN, false otherwise
 */
export default function isISBN(isbn: string, options?: IsISBNOptions | string | number): boolean {
  assertString(isbn)

  // For backwards compatibility:
  // isISBN(str [, version]), i.e. `options` could be used as argument for the legacy `version`
  const version = String(typeof options === 'object' ? options?.version : options)

  if (!options) {
    return isISBN(isbn, { version: 10 }) || isISBN(isbn, { version: 13 })
  }

  const sanitizedIsbn = isbn.replace(/[\s-]+/g, '')

  let checksum = 0

  if (version === '10') {
    if (!possibleIsbn10.test(sanitizedIsbn)) {
      return false
    }

    for (let i = 0; i < 9; i++) {
      checksum += (i + 1) * Number.parseInt(sanitizedIsbn.charAt(i), 10)
    }

    if (sanitizedIsbn.charAt(9) === 'X') {
      checksum += 10 * 10
    }
    else {
      checksum += 10 * Number.parseInt(sanitizedIsbn.charAt(9), 10)
    }

    if ((checksum % 11) === 0) {
      return true
    }
  }
  else if (version === '13') {
    if (!possibleIsbn13.test(sanitizedIsbn)) {
      return false
    }

    for (let i = 0; i < 12; i++) {
      checksum += factor[i % 2] * Number.parseInt(sanitizedIsbn.charAt(i), 10)
    }

    if (Number.parseInt(sanitizedIsbn.charAt(12), 10) - ((10 - (checksum % 10)) % 10) === 0) {
      return true
    }
  }

  return false
}
