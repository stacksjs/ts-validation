/**
 * Converts any input value to a string.
 * @param input The value to convert to a string
 * @returns The string representation of the input
 */
export default function toString(input: any): string {
  if (input === null || typeof input === 'undefined') {
    return ''
  }

  if (typeof input === 'object' && input !== null) {
    input = typeof input.toString === 'function' ? input.toString() : Object.prototype.toString.call(input)
  }
  else if (input === 0 && Object.is(input, -0)) {
    return '-0'
  }

  return String(input)
}
