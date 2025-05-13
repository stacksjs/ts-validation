import type { IsAlphaOptions } from './types'
import { alpha } from './alpha'
import assertString from './util/assertString'

export default function isAlpha(_str: string, locale = 'en-US', options: IsAlphaOptions = {}): boolean {
  assertString(_str)

  let str = _str
  const { ignore } = options

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '')
    }
    else if (typeof ignore === 'string') {
      str = str.replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#s]/g, '\\$&')}]`, 'g'), '') // escape regex for ignore
    }
    else {
      throw new TypeError('ignore should be instance of a String or RegExp')
    }
  }

  if (locale in alpha) {
    return alpha[locale].test(str)
  }
  throw new Error(`Invalid locale '${locale}'`)
}

export const locales: string[] = Object.keys(alpha)
