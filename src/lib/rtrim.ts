import assertString from './util/assertString'

/**
 * rtrim
 *
 * @param str - The string to check
 * @param chars - Options object
 * @returns The processed string
 */
export default function rtrim(str: string, chars?: string): string {
  assertString(str)
  if (chars) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#Escaping
    const pattern = new RegExp(`[${chars.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`, 'g')
    return str.replace(pattern, '')
  }
  // Use a faster and more safe than regex trim method https://blog.stevenlevithan.com/archives/faster-trim-javascript
  let strIndex = str.length - 1
  while (/\s/.test(str.charAt(strIndex))) {
    strIndex -= 1
  }

  return str.slice(0, strIndex + 1)
}
