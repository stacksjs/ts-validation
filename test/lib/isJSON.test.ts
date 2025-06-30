import { describe, expect, test } from 'bun:test'
import isJSON from '../../src/lib/isJSON'

describe('isJSON', () => {
  describe('Basic JSON validation', () => {
    test('should validate basic JSON objects', () => {
      expect(isJSON('{}')).toBe(true)
      expect(isJSON('{"key": "value"}')).toBe(true)
      expect(isJSON('{"name": "John", "age": 30}')).toBe(true)
      expect(isJSON('{"nested": {"key": "value"}}')).toBe(true)
    })

    test('should validate JSON arrays', () => {
      expect(isJSON('[]')).toBe(true)
      expect(isJSON('[1, 2, 3]')).toBe(true)
      expect(isJSON('["a", "b", "c"]')).toBe(true)
      expect(isJSON('[{"key": "value"}, {"key2": "value2"}]')).toBe(true)
      expect(isJSON('[1, "string", true, null]')).toBe(true)
    })

    test('should validate JSON with different data types', () => {
      expect(isJSON('{"string": "value"}')).toBe(true)
      expect(isJSON('{"number": 42}')).toBe(true)
      expect(isJSON('{"float": 3.14}')).toBe(true)
      expect(isJSON('{"boolean": true}')).toBe(true)
      expect(isJSON('{"null": null}')).toBe(true)
      expect(isJSON('{"array": [1, 2, 3]}')).toBe(true)
      expect(isJSON('{"object": {"nested": "value"}}')).toBe(true)
    })

    test('should reject invalid JSON', () => {
      expect(isJSON('{')).toBe(false)
      expect(isJSON('}')).toBe(false)
      expect(isJSON('{"key": }')).toBe(false)
      expect(isJSON('{"key": "value",}')).toBe(false) // trailing comma
      expect(isJSON('{key: "value"}')).toBe(false) // unquoted key
      expect(isJSON('{\'key\': \'value\'}')).toBe(false) // single quotes
      expect(isJSON('undefined')).toBe(false)
      expect(isJSON('function() {}')).toBe(false)
    })

    test('should reject non-JSON strings', () => {
      expect(isJSON('not json')).toBe(false)
      expect(isJSON('123abc')).toBe(false)
      expect(isJSON('hello world')).toBe(false)
      expect(isJSON('')).toBe(false)
      expect(isJSON(' ')).toBe(false)
    })
  })

  describe('Primitive handling with allow_primitives option', () => {
    test('should reject primitives by default', () => {
      expect(isJSON('true')).toBe(false)
      expect(isJSON('false')).toBe(false)
      expect(isJSON('null')).toBe(false)
      expect(isJSON('42')).toBe(false)
      expect(isJSON('"string"')).toBe(false)
    })

    test('should allow primitives when allow_primitives is true', () => {
      const options = { allow_primitives: true }
      expect(isJSON('true', options)).toBe(true)
      expect(isJSON('false', options)).toBe(true)
      expect(isJSON('null', options)).toBe(true)
      expect(isJSON('42', options)).toBe(false) // numbers not in primitive list
      expect(isJSON('"string"', options)).toBe(false) // strings not in primitive list
      expect(isJSON('3.14', options)).toBe(false) // numbers not in primitive list
      expect(isJSON('-42', options)).toBe(false) // numbers not in primitive list
      expect(isJSON('0', options)).toBe(false) // numbers not in primitive list
    })

    test('should still validate objects and arrays with allow_primitives', () => {
      const options = { allow_primitives: true }
      expect(isJSON('{}', options)).toBe(true)
      expect(isJSON('[]', options)).toBe(true)
      expect(isJSON('{"key": "value"}', options)).toBe(true)
      expect(isJSON('[1, 2, 3]', options)).toBe(true)
    })

    test('should reject invalid JSON even with allow_primitives', () => {
      const options = { allow_primitives: true }
      expect(isJSON('undefined', options)).toBe(false)
      expect(isJSON('function() {}', options)).toBe(false)
      expect(isJSON('not json', options)).toBe(false)
      expect(isJSON('{invalid}', options)).toBe(false)
    })
  })

  describe('Complex JSON structures', () => {
    test('should validate deeply nested objects', () => {
      const deepObject = '{"level1": {"level2": {"level3": {"level4": "deep"}}}}'
      expect(isJSON(deepObject)).toBe(true)
    })

    test('should validate deeply nested arrays', () => {
      const deepArray = '[[[[[1, 2, 3]]]]]'
      expect(isJSON(deepArray)).toBe(true)
    })

    test('should validate mixed nested structures', () => {
      const mixed = '{"users": [{"name": "John", "contacts": [{"type": "email", "value": "john@example.com"}]}]}'
      expect(isJSON(mixed)).toBe(true)
    })

    test('should validate arrays with mixed types', () => {
      const mixedArray = '[1, "string", true, null, {"key": "value"}, [1, 2, 3]]'
      expect(isJSON(mixedArray)).toBe(true)
    })

    test('should validate objects with array values', () => {
      const objectWithArrays = '{"numbers": [1, 2, 3], "strings": ["a", "b", "c"], "booleans": [true, false]}'
      expect(isJSON(objectWithArrays)).toBe(true)
    })
  })

  describe('Edge cases', () => {
    test('should handle whitespace', () => {
      expect(isJSON('  {}  ')).toBe(true)
      expect(isJSON('\n{\n  "key": "value"\n}\n')).toBe(true)
      expect(isJSON('\t[\t1,\t2,\t3\t]\t')).toBe(true)
    })

    test('should handle empty structures', () => {
      expect(isJSON('{}')).toBe(true)
      expect(isJSON('[]')).toBe(true)
      expect(isJSON('{"empty_object": {}}')).toBe(true)
      expect(isJSON('{"empty_array": []}')).toBe(true)
    })

    test('should handle special characters in strings', () => {
      expect(isJSON('{"unicode": "🚀"}')).toBe(true)
      expect(isJSON('{"escaped": "line1\\nline2"}')).toBe(true)
      expect(isJSON('{"quotes": "\\"quoted\\""}')).toBe(true)
      expect(isJSON('{"backslash": "path\\\\to\\\\file"}')).toBe(true)
    })

    test('should handle large numbers', () => {
      expect(isJSON('{"large": 9007199254740991}')).toBe(true) // Number.MAX_SAFE_INTEGER
      expect(isJSON('{"negative": -9007199254740991}')).toBe(true)
      expect(isJSON('{"scientific": 1e10}')).toBe(true)
      expect(isJSON('{"decimal": 3.141592653589793}')).toBe(true)
    })

    test('should handle arrays with many elements', () => {
      const largeArray = `[${Array.from({ length: 1000 }).fill(1).join(',')}]`
      expect(isJSON(largeArray)).toBe(true)
    })

    test('should handle objects with many properties', () => {
      const properties = Array.from({ length: 100 }).fill(0).map((_, i) => `"key${i}": "value${i}"`).join(',')
      const largeObject = `{${properties}}`
      expect(isJSON(largeObject)).toBe(true)
    })
  })

  describe('Real-world JSON examples', () => {
    test('should validate API response format', () => {
      const apiResponse = '{"status": "success", "data": {"users": [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}]}, "meta": {"total": 2, "page": 1}}'
      expect(isJSON(apiResponse)).toBe(true)
    })

    test('should validate configuration files', () => {
      const config = '{"database": {"host": "localhost", "port": 5432, "ssl": true}, "cache": {"enabled": true, "ttl": 3600}}'
      expect(isJSON(config)).toBe(true)
    })

    test('should validate user data', () => {
      const userData = '{"user": {"name": "John Doe", "email": "john@example.com", "preferences": {"theme": "dark", "notifications": true}, "addresses": [{"type": "home", "street": "123 Main St", "city": "Anytown"}]}}'
      expect(isJSON(userData)).toBe(true)
    })

    test('should validate shopping cart data', () => {
      const cart = '{"items": [{"id": "prod1", "name": "Widget", "price": 19.99, "quantity": 2}, {"id": "prod2", "name": "Gadget", "price": 29.99, "quantity": 1}], "total": 69.97, "currency": "USD"}'
      expect(isJSON(cart)).toBe(true)
    })

    test('should validate log entries', () => {
      const logEntry = '{"timestamp": "2023-01-01T12:00:00Z", "level": "INFO", "message": "User logged in", "user_id": 12345, "ip": "192.168.1.1", "metadata": {"browser": "Chrome", "version": "108.0.0.0"}}'
      expect(isJSON(logEntry)).toBe(true)
    })

    test('should validate GeoJSON format', () => {
      const geoJson = '{"type": "Feature", "geometry": {"type": "Point", "coordinates": [-74.006, 40.7128]}, "properties": {"name": "New York City"}}'
      expect(isJSON(geoJson)).toBe(true)
    })
  })

  describe('Error conditions', () => {
    test('should handle malformed JSON gracefully', () => {
      expect(isJSON('{"key": "value"')).toBe(false) // missing closing brace
      expect(isJSON('{"key": "value"}}')).toBe(false) // extra closing brace
      expect(isJSON('{"key": "value",}')).toBe(false) // trailing comma
      expect(isJSON('{"key": value}')).toBe(false) // unquoted value
      expect(isJSON('{"key": "value"; "key2": "value2"}')).toBe(false) // semicolon instead of comma
    })

    test('should handle circular reference attempts', () => {
      // These would be caught by JSON.parse throwing an error
      expect(isJSON('[object Object]')).toBe(false)
      expect(isJSON('[object HTMLElement]')).toBe(false)
    })

    test('should handle invalid escape sequences', () => {
      expect(isJSON('{"invalid": "\\x"}')).toBe(false)
      expect(isJSON('{"invalid": "\\u"}')).toBe(false)
      expect(isJSON('{"invalid": "\\uGGGG"}')).toBe(false)
    })
  })

  describe('Performance considerations', () => {
    test('should handle reasonably large JSON strings', () => {
      // Create a moderately large but valid JSON string
      const largeData = {
        users: Array.from({ length: 100 }).fill(0).map((_, i) => ({
          id: i,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          active: i % 2 === 0,
        })),
      }
      expect(isJSON(JSON.stringify(largeData))).toBe(true)
    })

    test('should reject very obviously invalid strings quickly', () => {
      expect(isJSON('clearly not json at all')).toBe(false)
      expect(isJSON('12345abcdef')).toBe(false)
      expect(isJSON('function test() { return true; }')).toBe(false)
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isJSON(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isJSON(null as any)).toThrow('Expected a string but received a null')
      expect(() => isJSON(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isJSON({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isJSON([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
