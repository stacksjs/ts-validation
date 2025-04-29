import assertString from './util/assertString'

const magnetURIComponent = /(?:^magnet:\?|[^?&]&)xt(?:\.1)?=urn:(?:(?:aich|bitprint|btih|ed2k|ed2khash|kzhash|md5|sha1|tree:tiger):[a-z0-9]{32}(?:[a-z0-9]{8})?|btmh:1220[a-z0-9]{64})(?:$|&)/i

/**
 * Check if the string is MagnetURI
 *
 * @param url - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isMagnetURI(url: string): boolean {
  assertString(url)

  if (url.indexOf('magnet:?') !== 0) {
    return false
  }

  return magnetURIComponent.test(url)
}
