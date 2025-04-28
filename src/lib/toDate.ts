/**
 * Convert a string to a date.
 * @param date The date string to convert
 * @returns A Date object if the input is a valid date, null otherwise
 */
export default function toDate(date: string | number | Date): Date | null {
  if (date === null || date === undefined) {
    return null
  }

  if (date instanceof Date) {
    return new Date(date.getTime())
  }

  if (typeof date !== 'string' && typeof date !== 'number') {
    return null
  }

  // Cast to any to avoid TypeScript overloads confusion for Date constructor
  const timestamp = Date.parse(date as any)

  if (!Number.isNaN(timestamp)) {
    return new Date(timestamp)
  }

  return null
}
