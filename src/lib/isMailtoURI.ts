import isEmail from './isEmail'
import trim from './trim'
import assertString from './util/assertString'

function parseMailtoQueryString(queryString: string) {
  const allowedParams = new Set(['subject', 'body', 'cc', 'bcc'])
  const query = { cc: '', bcc: '' }
  let isParseFailed = false

  const queryParams = queryString.split('&')

  if (queryParams.length > 4) {
    return false
  }

  for (const q of queryParams) {
    const [key, value] = q.split('=')

    // checked for invalid and duplicated query params
    if (key && !allowedParams.has(key)) {
      isParseFailed = true
      break
    }

    if (value && (key === 'cc' || key === 'bcc')) {
      query[key] = value
    }

    if (key) {
      allowedParams.delete(key)
    }
  }

  return isParseFailed ? false : query
}

/**
 * Check if the string is MailtoURI
 *
 * @param url - Options object
 * @param options - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMailtoURI(url: string, options: any) {
  assertString(url)

  if (url.indexOf('mailto:') !== 0) {
    return false
  }

  const [to, queryString = ''] = url.replace('mailto:', '').split('?')

  if (!to && !queryString) {
    return true
  }

  const query = parseMailtoQueryString(queryString)

  if (!query) {
    return false
  }

  return `${to},${query.cc},${query.bcc}`
    .split(',')
    .every((email) => {
      email = trim(email, ' ')

      if (email) {
        return isEmail(email, options)
      }

      return true
    })
}
