import { describe, expect, test } from 'bun:test'
import { text } from '../../src/validators/text'

describe('TextValidator', () => {
  describe('basic validation', () => {
    test('should validate text strings', () => {
      const validator = text()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('world')).toBe(true)
      expect(validator.test('')).toBe(true) // empty string is valid when optional
      expect(validator.test('123')).toBe(true) // numbers as strings are valid text
      expect(validator.test('Hello, World!')).toBe(true)
      expect(validator.test('Multi\nline\ntext')).toBe(true)
    })

    test('should reject non-string values', () => {
      const validator = text()
      expect(validator.test(123 as any)).toBe(false) // number
      expect(validator.test(true as any)).toBe(false) // boolean
      expect(validator.test(null as any)).toBe(true) // null is valid when optional
      expect(validator.test(undefined as any)).toBe(true) // undefined is valid when optional
      expect(validator.test({} as any)).toBe(false) // object
      expect(validator.test([] as any)).toBe(false) // array
      expect(validator.test(new Date() as any)).toBe(false) // date
    })

    test('should have correct name', () => {
      const validator = text()
      expect(validator.name).toBe('text')
    })
  })

  describe('length validation (inherited from StringValidator)', () => {
    test('min() should validate minimum length', () => {
      const validator = text().min(3)
      expect(validator.test('abc')).toBe(true)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('ab')).toBe(false)
      expect(validator.test('')).toBe(true) // empty is valid when optional
    })

    test('max() should validate maximum length', () => {
      const validator = text().max(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('hi')).toBe(true)
      expect(validator.test('hello world')).toBe(false)
      expect(validator.test('')).toBe(true)
    })

    test('length() should validate exact length', () => {
      const validator = text().length(5)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('world')).toBe(true)
      expect(validator.test('hi')).toBe(false)
      expect(validator.test('hello world')).toBe(false)
      expect(validator.test('')).toBe(true) // empty is valid when optional
    })

    test('should combine min and max', () => {
      const validator = text().min(3).max(10)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('abc')).toBe(true)
      expect(validator.test('1234567890')).toBe(true)
      expect(validator.test('ab')).toBe(false) // too short
      expect(validator.test('12345678901')).toBe(false) // too long
    })
  })

  describe('pattern matching (inherited from StringValidator)', () => {
    test('matches() should validate regex patterns', () => {
      const validator = text().matches(/^[A-Z][a-z]+$/)
      expect(validator.test('Hello')).toBe(true)
      expect(validator.test('World')).toBe(true)
      expect(validator.test('hello')).toBe(false) // lowercase first letter
      expect(validator.test('HELLO')).toBe(false) // all uppercase
      expect(validator.test('Hello123')).toBe(false) // contains numbers
    })

    test('should work with complex patterns', () => {
      // Validate markdown headers
      const validator = text().matches(/^#{1,6}\s+(?:\S.*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])$/)
      expect(validator.test('# Title')).toBe(true)
      expect(validator.test('## Subtitle')).toBe(true)
      expect(validator.test('### Section')).toBe(true)
      expect(validator.test('Regular text')).toBe(false)
      expect(validator.test('#NoSpace')).toBe(false)
    })
  })

  describe('character type validation (inherited from StringValidator)', () => {
    test('alphanumeric() should validate alphanumeric text', () => {
      const validator = text().alphanumeric()
      expect(validator.test('abc123')).toBe(true)
      expect(validator.test('ABC123')).toBe(true)
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('123')).toBe(true)
      expect(validator.test('hello world')).toBe(false) // contains space
      expect(validator.test('hello!')).toBe(false) // contains special character
    })

    test('alpha() should validate alphabetic text', () => {
      const validator = text().alpha()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('WORLD')).toBe(true)
      expect(validator.test('HelloWorld')).toBe(true)
      expect(validator.test('hello123')).toBe(false) // contains numbers
      expect(validator.test('hello world')).toBe(false) // contains space
    })

    test('numeric() should validate numeric text', () => {
      const validator = text().numeric()
      expect(validator.test('123')).toBe(true)
      expect(validator.test('0')).toBe(true)
      expect(validator.test('999999')).toBe(true)
      expect(validator.test('123abc')).toBe(false) // contains letters
      expect(validator.test('12.34')).toBe(true) // decimal point is allowed in numeric validation
    })
  })

  describe('custom validation (inherited from StringValidator)', () => {
    test('custom() should accept custom validation functions', () => {
      const validator = text().custom(
        (value: string) => value.includes('test'),
        'Must contain the word "test"',
      )

      expect(validator.test('this is a test')).toBe(true)
      expect(validator.test('testing 123')).toBe(true)
      expect(validator.test('hello world')).toBe(false)
    })

    test('should provide custom error messages', () => {
      const validator = text().custom(
        (value: string) => value.startsWith('prefix-'),
        'Must start with "prefix-"',
      )

      const result = validator.validate('invalid')
      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors[0].message).toBe('Must start with "prefix-"')
      }
    })
  })

  describe('chaining validations', () => {
    test('should chain multiple validations', () => {
      const validator = text().min(5).max(20).matches(/^[A-Z\s]+$/i)
      expect(validator.test('Hello World')).toBe(true)
      expect(validator.test('Short')).toBe(true) // 5 chars exactly, meets minimum
      expect(validator.test('This is a very long text that exceeds the limit')).toBe(false) // too long
      expect(validator.test('Hello123')).toBe(false) // contains numbers
    })

    test('should validate all rules in chain', () => {
      const validator = text()
        .min(3)
        .max(10)
        .custom((value: string) => !value.includes('bad'), 'Cannot contain "bad"')

      expect(validator.test('good')).toBe(true)
      expect(validator.test('ok')).toBe(false) // too short
      expect(validator.test('this is too long')).toBe(false) // too long
      expect(validator.test('bad word')).toBe(false) // contains "bad"
    })
  })

  describe('required and optional', () => {
    test('required() should reject empty values', () => {
      const validator = text().required()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(false)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept empty values', () => {
      const validator = text().optional()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with other validations when optional', () => {
      const validator = text().min(5).optional()
      expect(validator.test('hello')).toBe(true)
      expect(validator.test('')).toBe(true) // empty is valid when optional
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test('hi')).toBe(false) // too short when not empty
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = text().min(5)
      const result = validator.validate('hi')

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
        expect(result.errors[0].message).toContain('Must be at least')
      }
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = text().min(10).max(5) // impossible constraint
      const result = validator.validate('hello')

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(true)
      if (Array.isArray(result.errors)) {
        expect(result.errors.length).toBeGreaterThan(0)
      }
    })
  })

  describe('edge cases', () => {
    test('should handle unicode text', () => {
      const validator = text()
      expect(validator.test('Hello 世界')).toBe(true)
      expect(validator.test('🌟 emoji text')).toBe(true)
      expect(validator.test('café résumé')).toBe(true)
      expect(validator.test('Ελληνικά')).toBe(true) // Greek
      expect(validator.test('العربية')).toBe(true) // Arabic
    })

    test('should handle very long text', () => {
      const validator = text()
      const longText = 'a'.repeat(10000)
      expect(validator.test(longText)).toBe(true)
    })

    test('should handle special characters', () => {
      const validator = text()
      expect(validator.test('Hello, World!')).toBe(true)
      expect(validator.test('Price: $19.99')).toBe(true)
      expect(validator.test('Email: user@example.com')).toBe(true)
      expect(validator.test('Path: /home/user/file.txt')).toBe(true)
      expect(validator.test('Code: function() { return true; }')).toBe(true)
    })

    test('should handle multiline text', () => {
      const validator = text()
      const multilineText = `Line 1
Line 2
Line 3`
      expect(validator.test(multilineText)).toBe(true)
    })

    test('should handle whitespace variations', () => {
      const validator = text()
      expect(validator.test('   ')).toBe(true) // spaces
      expect(validator.test('\t')).toBe(true) // tab
      expect(validator.test('\n')).toBe(true) // newline
      expect(validator.test('\r\n')).toBe(true) // carriage return + newline
    })
  })

  describe('real-world use cases', () => {
    test('should validate user comments', () => {
      const validator = text().min(1).max(500)

      expect(validator.test('Great article!')).toBe(true)
      expect(validator.test('This is a longer comment with more details about the topic.')).toBe(true)
      expect(validator.test('')).toBe(true) // empty is valid when optional
      expect(validator.test('a'.repeat(501))).toBe(false) // too long
    })

    test('should validate article content', () => {
      const validator = text().min(100).max(10000)

      const shortArticle = 'This is a short article that meets the minimum length requirement for publication. It contains enough content to be considered a proper article with meaningful information for readers.'
      const longArticle = 'This is a much longer article. '.repeat(200) // ~6400 chars

      expect(validator.test(shortArticle)).toBe(true)
      expect(validator.test(longArticle)).toBe(true)
      expect(validator.test('Too short')).toBe(false)
      expect(validator.test('x'.repeat(10001))).toBe(false)
    })

    test('should validate search queries', () => {
      const validator = text()
        .min(1)
        .max(100)
        .custom((value: string) => !value.includes('<'), 'Cannot contain HTML tags')

      expect(validator.test('javascript tutorial')).toBe(true)
      expect(validator.test('how to learn programming')).toBe(true)
      expect(validator.test('')).toBe(true) // empty is valid when optional
      expect(validator.test('<script>alert("xss")</script>')).toBe(false) // contains HTML
      expect(validator.test('a'.repeat(101))).toBe(false) // too long
    })

    test('should validate file content', () => {
      const validator = text().custom(
        (value: string) => {
          // Check if it's valid JSON
          try {
            JSON.parse(value)
            return true
          }
          catch {
            return false
          }
        },
        'Must be valid JSON',
      )

      expect(validator.test('{"name": "John", "age": 30}')).toBe(true)
      expect(validator.test('[]')).toBe(true)
      expect(validator.test('null')).toBe(true)
      expect(validator.test('"string"')).toBe(true)
      expect(validator.test('invalid json')).toBe(false)
      expect(validator.test('{"name": "John"')).toBe(false) // malformed
    })

    test('should validate markdown content', () => {
      const validator = text().custom(
        (value: string) => {
          // Simple markdown validation - must contain at least one header
          return /^#{1,6}\s+(?:\S.*|[\t\v\f \xA0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF])$/m.test(value)
        },
        'Must contain at least one markdown header',
      )

      const validMarkdown = `# Title

This is some content under the title.

## Subtitle

More content here.`

      const invalidMarkdown = `This is just regular text
without any headers.`

      expect(validator.test(validMarkdown)).toBe(true)
      expect(validator.test(invalidMarkdown)).toBe(false)
    })
  })

  describe('type safety', () => {
    test('should work with typed string values', () => {
      const validator = text()
      const typedString: string = 'hello'
      expect(validator.test(typedString)).toBe(true)
    })

    test('should maintain type information for validated text', () => {
      const validator = text().min(3)
      const result = validator.validate('hello')
      expect(result.valid).toBe(true)
    })
  })
})
