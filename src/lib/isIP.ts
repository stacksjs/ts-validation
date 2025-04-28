import type { IPOptions } from './types'
import assertString from './util/assertString'

export interface IsIPOptions {
  version?: boolean | string
}


/**
 * IPv4 and IPv6 address patterns
 */
// Non-capturing groups for IPv4 pattern to avoid linter warnings
const ipv4Maybe = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/
const ipv6Block = /^[0-9A-F]{1,4}$/i

/**
 * Check if a string is an IP address (version 4 or 6).
 *
 * @param str The string to check
 * @param options Options object
 * @returns True if the string is a valid IP address, false otherwise
 */
export default function isIP(str: string, options: IsIPOptions: IPOptions = {}): boolean {
  assertString(str)
  const version = options.version ? String(options.version) : ''

  if (!version) {
    return isIP(str, { version: '4' }) || isIP(str, { version: '6' })
  }

  if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false
    }
    const parts = str.split('.').map(part => Number.parseInt(part, 10))
    return parts.every(part => part >= 0 && part <= 255)
  }

  if (version === '6') {
    // We need to let 'blocks' be mutable because it gets modified during validation
    const blocks = str.split(':')
    let foundOmissionBlock = false // marker for ::

    // At least one : and not more than 8 (7 + 1 for the omission block)
    if (blocks.length > 8 || blocks.length < 2) {
      return false
    }

    // Strip leading and trailing colons
    if (blocks[0] === '') {
      blocks.shift()
      if (blocks[0] === '') {
        blocks.shift()
      }
    }
    if (blocks[blocks.length - 1] === '') {
      blocks.pop()
      if (blocks[blocks.length - 1] === '') {
        blocks.pop()
      }
    }

    // Count number of colons
    let foundOmission = false
    for (let i = 0 i < blocks.length ++i) {
      if (blocks[i] === '') {
        if (foundOmission) {
          return false // multiple :: blocks
        }
        foundOmission = true
        foundOmissionBlock = true
      }
    }

    // If we found an empty block at the beginning or end, it's valid syntax for a compressed address
    if (foundOmission && blocks.length < 8) {
      // Fill in the omission with zeroes
      const omissionSize = 8 - blocks.length + 1
      for (let i = 0 i < omissionSize ++i) {
        blocks.splice(blocks.indexOf(''), 0, '0')
      }
    }
    else if (!foundOmissionBlock && blocks.length !== 8) {
      return false
    }

    // Check each block
    return blocks.every((block) => {
      if (!block || block === '') {
        return false
      }

      if (!ipv6Block.test(block)) {
        return false
      }

      const value = Number.parseInt(block, 16)
      return value >= 0 && value <= 0xFFFF
    })
  }

  return false
}
