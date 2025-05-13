/**
 * Better way to handle type checking
 * null, {}, array and date are objects, which confuses
 */
export default function typeOf(input: unknown): string {
  const rawObject = Object.prototype.toString.call(input).toLowerCase()
  const typeOfRegex = /\[object (.*)\]/
  const type = typeOfRegex.exec(rawObject)?.[1] ?? 'unknown'
  return type
}
