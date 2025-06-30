import { describe, expect, test } from 'bun:test'
import isAlpha from '../../src/lib/isAlpha'

describe('isAlpha', () => {
  describe('basic validation', () => {
    test('should validate alphabetic strings', () => {
      expect(isAlpha('hello')).toBe(true)
      expect(isAlpha('world')).toBe(true)
      expect(isAlpha('ABC')).toBe(true)
      expect(isAlpha('xyz')).toBe(true)
      expect(isAlpha('MixedCase')).toBe(true)
    })

    test('should reject non-alphabetic strings', () => {
      expect(isAlpha('hello123')).toBe(false)
      expect(isAlpha('123')).toBe(false)
      expect(isAlpha('hello world')).toBe(false) // space
      expect(isAlpha('hello-world')).toBe(false) // hyphen
      expect(isAlpha('hello_world')).toBe(false) // underscore
      expect(isAlpha('hello@world')).toBe(false) // special character
      expect(isAlpha('')).toBe(false) // empty string
    })

    test('should handle edge cases', () => {
      expect(isAlpha('a')).toBe(true) // single character
      expect(isAlpha('Z')).toBe(true) // single uppercase
      expect(isAlpha('aZ')).toBe(true) // mixed case
    })
  })

  describe('locale-specific validation', () => {
    test('should validate English alphabet by default', () => {
      expect(isAlpha('abcdefghijklmnopqrstuvwxyz')).toBe(true)
      expect(isAlpha('ABCDEFGHIJKLMNOPQRSTUVWXYZ')).toBe(true)
    })

    test('should handle locale parameter', () => {
      // Test with en-US locale
      expect(isAlpha('hello', 'en-US')).toBe(true)
      expect(isAlpha('HELLO', 'en-US')).toBe(true)
      expect(isAlpha('hello123', 'en-US')).toBe(false)
    })

    test('should validate German characters with de-DE locale', () => {
      expect(isAlpha('hallo', 'de-DE')).toBe(true)
      expect(isAlpha('straße', 'de-DE')).toBe(true) // German ß
      expect(isAlpha('Müller', 'de-DE')).toBe(true) // German ü
      expect(isAlpha('Österreich', 'de-DE')).toBe(true) // German ö
    })

    test('should validate French characters with fr-FR locale', () => {
      expect(isAlpha('bonjour', 'fr-FR')).toBe(true)
      expect(isAlpha('café', 'fr-FR')).toBe(true) // é
      expect(isAlpha('naïve', 'fr-FR')).toBe(true) // ï
      expect(isAlpha('français', 'fr-FR')).toBe(true) // ç
    })

    test('should validate Spanish characters with es-ES locale', () => {
      expect(isAlpha('hola', 'es-ES')).toBe(true)
      expect(isAlpha('niño', 'es-ES')).toBe(true) // ñ
      expect(isAlpha('José', 'es-ES')).toBe(true) // é
    })

    test('should validate Arabic characters with ar locale', () => {
      expect(isAlpha('مرحبا', 'ar')).toBe(true) // Arabic "hello"
      expect(isAlpha('العربية', 'ar')).toBe(true) // Arabic "Arabic"
    })

    test('should handle unsupported locales', () => {
      // zh-CN is not supported in the current implementation
      expect(() => isAlpha('你好', 'zh-CN')).toThrow('Invalid locale \'zh-CN\'')
      expect(() => isAlpha('中文', 'zh-CN')).toThrow('Invalid locale \'zh-CN\'')
    })
  })

  describe('options parameter', () => {
    test('should work with ignore option', () => {
      const options = { ignore: ' -' }
      expect(isAlpha('hello world', 'en-US', options)).toBe(true) // ignore space
      expect(isAlpha('hello-world', 'en-US', options)).toBe(true) // ignore hyphen
      expect(isAlpha('hello world-test', 'en-US', options)).toBe(true) // ignore both
      expect(isAlpha('hello_world', 'en-US', options)).toBe(false) // underscore not ignored
    })

    test('should handle multiple ignore characters', () => {
      const options = { ignore: ' -_.' }
      expect(isAlpha('hello world', 'en-US', options)).toBe(true)
      expect(isAlpha('hello-world', 'en-US', options)).toBe(true)
      expect(isAlpha('hello_world', 'en-US', options)).toBe(true)
      expect(isAlpha('hello.world', 'en-US', options)).toBe(true)
      expect(isAlpha('hello@world', 'en-US', options)).toBe(false) // @ not ignored
    })

    test('should handle empty ignore string', () => {
      const options = { ignore: '' }
      expect(isAlpha('hello', 'en-US', options)).toBe(true)
      expect(isAlpha('hello world', 'en-US', options)).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle unicode characters', () => {
      // French locale supports these characters
      expect(isAlpha('café', 'fr-FR')).toBe(true) // é
      expect(isAlpha('naïve', 'fr-FR')).toBe(true) // ï
      expect(isAlpha('résumé', 'fr-FR')).toBe(true) // é
      // German locale supports ü
      expect(isAlpha('Zürich', 'de-DE')).toBe(true) // ü
      // Portuguese locale supports ã
      expect(isAlpha('São', 'pt-PT')).toBe(true) // ã
      // Default en-US locale doesn't support these
      expect(isAlpha('café')).toBe(false) // é not in en-US
    })

    test('should handle mixed scripts', () => {
      // Mixed scripts are not supported in single locale validation
      expect(isAlpha('helloмир')).toBe(false) // English + Cyrillic not valid in en-US
      expect(isAlpha('мир', 'ru-RU')).toBe(true) // Cyrillic valid in Russian locale
      expect(isAlpha('hello')).toBe(true) // English valid in default en-US
    })

    test('should reject numbers and symbols', () => {
      expect(isAlpha('hello1')).toBe(false)
      expect(isAlpha('hello!')).toBe(false)
      expect(isAlpha('hello?')).toBe(false)
      expect(isAlpha('hello.')).toBe(false)
      expect(isAlpha('hello,')).toBe(false)
      expect(isAlpha('hello;')).toBe(false)
      expect(isAlpha('hello:')).toBe(false)
    })

    test('should handle whitespace characters', () => {
      expect(isAlpha('hello world')).toBe(false) // space
      expect(isAlpha('hello\tworld')).toBe(false) // tab
      expect(isAlpha('hello\nworld')).toBe(false) // newline
      expect(isAlpha('hello\rworld')).toBe(false) // carriage return
    })

    test('should handle special Unicode categories', () => {
      // Mathematical bold letters are not in standard locale patterns
      expect(isAlpha('𝐀𝐁𝐂')).toBe(false) // Mathematical bold letters not supported
      expect(isAlpha('𝒜ℬ𝒞')).toBe(false) // Mathematical script letters not supported
      expect(isAlpha('🅰🅱🅲')).toBe(false) // Emoji letters (not typically considered alphabetic)
      // Standard letters work
      expect(isAlpha('ABC')).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('should validate names', () => {
      expect(isAlpha('John')).toBe(true)
      expect(isAlpha('Mary')).toBe(true)
      // Names with accents need appropriate locales
      expect(isAlpha('José', 'es-ES')).toBe(true)
      expect(isAlpha('François', 'fr-FR')).toBe(true)
      expect(isAlpha('Müller', 'de-DE')).toBe(true)
      // Without locale, accented names fail
      expect(isAlpha('José')).toBe(false)
      expect(isAlpha('O\'Connor', 'en-US', { ignore: '\'' })).toBe(true) // with apostrophe
      expect(isAlpha('Van Der Berg', 'en-US', { ignore: ' ' })).toBe(true) // with spaces
    })

    test('should validate words in different languages', () => {
      expect(isAlpha('beautiful')).toBe(true) // English
      expect(isAlpha('schön', 'de-DE')).toBe(true) // German
      expect(isAlpha('beau', 'fr-FR')).toBe(true) // French
      expect(isAlpha('hermoso', 'es-ES')).toBe(true) // Spanish
      expect(isAlpha('красивый', 'ru-RU')).toBe(true) // Russian - use ru-RU instead of ru
    })

    test('should validate input sanitization scenarios', () => {
      // Common cases where you want only alphabetic input
      expect(isAlpha('username')).toBe(true) // valid username base
      expect(isAlpha('username123')).toBe(false) // with numbers
      expect(isAlpha('user_name')).toBe(false) // with underscore
      expect(isAlpha('user-name')).toBe(false) // with hyphen
      expect(isAlpha('user@name')).toBe(false) // with special char
    })
  })

  describe('parameter validation', () => {
    test('should handle invalid input types gracefully', () => {
      // The function throws for non-string inputs due to assertString
      expect(() => isAlpha(null as any)).toThrow('Expected a string but received a null')
      expect(() => isAlpha(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isAlpha(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isAlpha({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isAlpha([] as any)).toThrow('Expected a string but received a Array')
    })

    test('should handle invalid locale strings', () => {
      expect(() => isAlpha('hello', 'invalid-locale')).toThrow('Invalid locale \'invalid-locale\'')
      expect(() => isAlpha('hello', '')).toThrow('Invalid locale \'\'')
      // null locale would cause issues, but let's test what happens
      expect(() => isAlpha('hello', null as any)).toThrow()
    })

    test('should handle invalid options', () => {
      expect(() => isAlpha('hello', 'en-US', null as any)).toThrow()
      expect(() => isAlpha('hello', 'en-US', undefined as any)).not.toThrow()
      // String is not a valid options type, but it might not throw immediately
      expect(() => isAlpha('hello', 'en-US', 'invalid' as any)).not.toThrow()
    })
  })

  describe('performance considerations', () => {
    test('should handle long strings efficiently', () => {
      const longAlphaString = 'a'.repeat(10000)
      const longMixedString = `${'a'.repeat(5000)}1${'b'.repeat(4999)}`

      expect(isAlpha(longAlphaString)).toBe(true)
      expect(isAlpha(longMixedString)).toBe(false)
    })

    test('should handle strings with many unicode characters', () => {
      const unicodeString = 'café'.repeat(1000) // é repeated many times
      expect(isAlpha(unicodeString)).toBe(false) // é not supported in en-US
      expect(isAlpha(unicodeString, 'fr-FR')).toBe(true) // é supported in fr-FR
    })
  })

  describe('consistency with related functions', () => {
    test('should be consistent with alphanumeric validation', () => {
      // Strings that are alpha should also be alphanumeric when combined with numbers
      const alphaStrings = ['hello', 'world', 'test', 'ABC']

      alphaStrings.forEach((str) => {
        expect(isAlpha(str)).toBe(true)
        // These would be true for isAlphanumeric but we're just testing alpha consistency
      })
    })

    test('should complement numeric validation', () => {
      // Strings that are purely numeric should not be alpha
      const numericStrings = ['123', '456', '0', '999']

      numericStrings.forEach((str) => {
        expect(isAlpha(str)).toBe(false)
      })
    })
  })
})
