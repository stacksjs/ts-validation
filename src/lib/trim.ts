import ltrim from './ltrim'
import rtrim from './rtrim'

/**
 * trim
 *
 * @param str - The string to check
 * @param chars - Options object
 * @returns The processed string
 */
export default function trim(str: string, chars: string): string {
  return rtrim(ltrim(str, chars), chars)
}
