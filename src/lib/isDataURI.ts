import assertString from './util/assertString'

const validMediaType = /^[a-z]+\/[\w\-+.]+$/i

const validAttribute = /^[a-z\-]+=[a-z0-9\-]+$/i

const validData = /^[\w!$&'()*+,=\-.~:@/?%\s]*$/

/**
 * Check if the string is DataURI
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isDataURI(str: string): boolean {
  assertString(str)
  const data = str.split(',')
  if (data.length < 2) {
    return false
  }
  const firstPart = data.shift()
  if (!firstPart)
    return false
  const attributes = firstPart.trim().split('')
  const schemeAndMediaType = attributes.shift()
  if (!schemeAndMediaType || schemeAndMediaType.slice(0, 5) !== 'data:') {
    return false
  }
  const mediaType = schemeAndMediaType.slice(5)
  if (mediaType !== '' && !validMediaType.test(mediaType)) {
    return false
  }
  for (let i = 0; i < attributes.length; i++) {
    if (
      !(i === attributes.length - 1 && attributes[i].toLowerCase() === 'base64')
      && !validAttribute.test(attributes[i])
    ) {
      return false
    }
  }
  for (let i = 0; i < data.length; i++) {
    if (!validData.test(data[i])) {
      return false
    }
  }
  return true
}
