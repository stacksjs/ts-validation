/**
 * Checks if a value exists in an array.
 *
 * @param arr - The array to search in
 * @param val - The value to find
 * @returns True if the value is found in the array, false otherwise
 */
const includes = <T>(arr: T[], val: T): boolean => arr.includes(val)

export default includes
