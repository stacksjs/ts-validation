import assertString from './util/assertString'

/*
  Checks if the provided string matches to a correct Media type format (MIME type)

  This function only checks is the string format follows the
  established rules by the according RFC specifications.
  This function supports 'charset' in textual media types
  (https://tools.ietf.org/html/rfc6657).

  This function does not check against all the media types listed
  by the IANA (https://www.iana.org/assignments/media-types/media-types.xhtml)
  because of lightness purposes : it would require to include
  all these MIME types in this library, which would weigh it
  significantly. This kind of effort maybe is not worth for the use that
  this function has in this entire library.

  More information in the RFC specifications :
  - https://tools.ietf.org/html/rfc2045
  - https://tools.ietf.org/html/rfc2046
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.1
  - https://tools.ietf.org/html/rfc7231#section-3.1.1.5
*/

// Match simple MIME types
// NB :
//   Subtype length must not exceed 100 characters.
//   This rule does not comply to the RFC specs (what is the max length ?).
const mimeTypeSimple = /^(?:application|audio|font|image|message|model|multipart|text|video)\/[\w.\-+]{1,100}$/i

// Handle "charset" in "text/*"
const mimeTypeText = /^text\/[a-z0-9.\-+]{1,100}\s?charset=(?:"[a-z0-9.\-+\s]{0,70}"|[a-z0-9.\-+]{0,70})(?:\s?\([a-z0-9.\-+\s]{1,20}\))?$/i

// Handle "boundary" in "multipart/*"
const mimeTypeMultipart = /^multipart\/[a-z0-9.\-+]{1,100}(?:\s?(?:boundary|charset)=(?:"[a-z0-9.\-+\s]{0,70}"|[a-z0-9.\-+]{0,70})(?:\s?\([a-z0-9.\-+\s]{1,20}\))?){0,2}$/i

/**
 * Check if the string is MimeType
 *
 * @param str - The string to check
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMimeType(str: string): boolean {
  assertString(str)
  return mimeTypeSimple.test(str) || mimeTypeText.test(str) || mimeTypeMultipart.test(str)
}
