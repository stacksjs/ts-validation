/**
 * Build RegExp object from an array
 * of multiple/multi-line regexp parts
 *
 * @param parts - Array of string patterns that make up the regex
 * @param flags - Regular expression flags
 * @returns A compiled RegExp object
 */
export default function multilineRegexp(parts: string[], flags?: string): RegExp {
  const regexpAsStringLiteral = parts.join('')

  return new RegExp(regexpAsStringLiteral, flags)
}
