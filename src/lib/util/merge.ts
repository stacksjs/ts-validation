/**
 * Merges multiple objects together and returns a new object.
 * @param obj The source object
 * @param defaults The default values object
 * @returns The merged object
 */
export default function merge<T extends object, U extends object>(obj: T = {} as T, defaults: U): T & U {
  for (const key in defaults) {
    // Using unknown as an intermediate type for type safety
    const objKey = key as unknown as keyof T
    if (typeof obj[objKey] === 'undefined') {
      (obj as any)[key] = defaults[key]
    }
  }

  return obj as T & U
}
