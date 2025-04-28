import assertString from './util/assertString'

const lengths = {
  md5: 32,
  md4: 32,
  sha1: 40,
  sha256: 64,
  sha384: 96,
  sha512: 128,
  ripemd128: 32,
  ripemd160: 40,
  tiger128: 32,
  tiger160: 40,
  tiger192: 48,
  crc32: 8,
  crc32b: 8,
}

/**
 * Check if the string is Hash
 *
 * @param str - The string to check
 * @param algorithm - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isHash(str: string, algorithm: string): boolean {
  assertString(str)
  const hash = new RegExp(`^[a-fA-F0-9]{${lengths[algorithm]}}$`)
  return hash.test(str)
}
