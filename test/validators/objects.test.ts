import { describe, expect, test } from 'bun:test'
import { boolean } from '../../src/validators/booleans'
import { number } from '../../src/validators/numbers'
import { object } from '../../src/validators/objects'
import { string } from '../../src/validators/strings'

describe('ObjectValidator', () => {
  describe('basic validation', () => {
    test('should validate objects', () => {
      const validator = object()
      expect(validator.test({})).toBe(true)
      expect(validator.test({ name: 'John' })).toBe(true)
      expect(validator.test({ name: 'John', age: 30 })).toBe(true)
      expect(validator.test(new Date())).toBe(true) // Date is an object
      expect(validator.test([])).toBe(false) // Array is not considered a plain object
      expect(validator.test('string' as any)).toBe(false)
      expect(validator.test(123 as any)).toBe(false)
      expect(validator.test(true as any)).toBe(false)
      expect(validator.test(null as any)).toBe(true) // null/undefined are valid when optional
      expect(validator.test(undefined as any)).toBe(true) // null/undefined are valid when optional
    })

    test('should have correct name', () => {
      const validator = object()
      expect(validator.name).toBe('object')
    })
  })

  describe('shape validation', () => {
    test('should validate object shape', () => {
      const validator = object().shape({
        name: string(),
        age: number(),
        active: boolean(),
      })

      expect(validator.test({
        name: 'John',
        age: 30,
        active: true,
      })).toBe(true)

      expect(validator.test({
        name: 'Jane',
        age: 25,
        active: false,
      })).toBe(true)

      // Missing properties - should pass since fields are optional by default
      expect(validator.test({
        name: 'John',
        age: 30,
      } as any)).toBe(true)

      // Wrong types
      expect(validator.test({
        name: 123,
        age: 30,
        active: true,
      } as any)).toBe(false)

      expect(validator.test({
        name: 'John',
        age: '30',
        active: true,
      } as any)).toBe(false)

      expect(validator.test({
        name: 'John',
        age: 30,
        active: 'yes',
      } as any)).toBe(false)
    })

    test('should handle nested objects', () => {
      const validator = object().shape({
        user: object().shape({
          name: string(),
          age: number(),
        }),
        settings: object().shape({
          theme: string(),
          notifications: boolean(),
        }),
      })

      expect(validator.test({
        user: {
          name: 'John',
          age: 30,
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      })).toBe(true)

      // Invalid nested object
      expect(validator.test({
        user: {
          name: 'John',
          age: '30', // wrong type
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      } as any)).toBe(false)

      // Missing nested property - should pass since fields are optional by default
      expect(validator.test({
        user: {
          name: 'John',
          // missing age
        },
        settings: {
          theme: 'dark',
          notifications: true,
        },
      } as any)).toBe(true)
    })

    test('should handle optional properties', () => {
      const validator = object().shape({
        name: string(),
        age: number().optional(),
        email: string().optional(),
      })

      expect(validator.test({
        name: 'John',
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        email: 'john@example.com',
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
        email: 'john@example.com',
      })).toBe(true)

      // Name property missing - should pass since name is not marked as required
      expect(validator.test({
        age: 30,
        email: 'john@example.com',
      } as any)).toBe(true)
    })
  })

  describe('strict validation', () => {
    test('should allow extra properties by default', () => {
      const validator = object().shape({
        name: string(),
        age: number(),
      })

      expect(validator.test({
        name: 'John',
        age: 30,
        extra: 'property',
      })).toBe(true)
    })

    test('strict() should reject extra properties', () => {
      const validator = object().shape({
        name: string(),
        age: number(),
      }).strict()

      expect(validator.test({
        name: 'John',
        age: 30,
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
        extra: 'property',
      })).toBe(false)
    })

    test('should handle strict validation with optional properties', () => {
      const validator = object().shape({
        name: string(),
        age: number().optional(),
        email: string().optional(),
      }).strict()

      expect(validator.test({
        name: 'John',
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
        email: 'john@example.com',
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: 30,
        email: 'john@example.com',
        extra: 'property',
      })).toBe(false)
    })
  })

  describe('validation constraints', () => {
    test('should validate with built-in constraints', () => {
      const validator = object().shape({
        name: string(),
        age: number().min(18), // Use built-in min validation instead of custom
      })

      expect(validator.test({
        name: 'John',
        age: 25,
      })).toBe(true)

      expect(validator.test({
        name: 'Jane',
        age: 17,
      })).toBe(false)
    })

    test('should validate with built-in string constraints', () => {
      const validator = object().shape({
        username: string().min(3),
        password: string().min(8),
      })

      const result = validator.validate({
        username: 'ab', // too short
        password: '1234567', // too short
      })

      expect(result.valid).toBe(false)
      expect(result.errors).toEqual({
        username: [{ message: 'Must be at least 3 characters long' }],
        password: [{ message: 'Must be at least 8 characters long' }],
      })
    })

    test('should chain multiple built-in validations', () => {
      const validator = object().shape({
        name: string(),
        age: number().min(18), // Built-in min validation
        email: string().email(), // Built-in email validation
      })

      expect(validator.test({
        name: 'John',
        age: 25,
        email: 'john@example.com',
      })).toBe(true)

      expect(validator.test({
        name: 'Jane',
        age: 17, // fails age check
        email: 'jane@example.com',
      })).toBe(false)

      expect(validator.test({
        name: 'Bob',
        age: 25,
        email: 'invalid-email', // fails email check
      })).toBe(false)
    })
  })

  describe('required and optional', () => {
    test('required() should reject null/undefined', () => {
      const validator = object().required()
      expect(validator.test({})).toBe(true)
      expect(validator.test({ name: 'John' })).toBe(true)
      expect(validator.test(null as any)).toBe(false)
      expect(validator.test(undefined as any)).toBe(false)
    })

    test('optional() should accept null/undefined', () => {
      const validator = object().optional()
      expect(validator.test({})).toBe(true)
      expect(validator.test({ name: 'John' })).toBe(true)
      expect(validator.test(null as any)).toBe(true)
      expect(validator.test(undefined as any)).toBe(true)
    })

    test('should work with shape validation when optional', () => {
      const validator = object().shape({
        name: string(),
        age: number(),
      }).optional()

      expect(validator.test({
        name: 'John',
        age: 30,
      })).toBe(true)

      expect(validator.test(null as any)).toBe(true) // optional
      expect(validator.test(undefined as any)).toBe(true) // optional

      expect(validator.test({
        name: 'John',
        // missing age
      } as any)).toBe(true) // age is optional by default
    })
  })

  describe('real-world object scenarios', () => {
    test('should validate user profile objects', () => {
      const validator = object({
        id: number(),
        username: string().min(3).max(20),
        email: string().email(),
        profile: object({
          firstName: string(),
          lastName: string(),
          age: number().min(13).max(120),
          bio: string().optional(),
        }),
        preferences: object({
          theme: string(),
          notifications: boolean(),
          language: string().optional(),
        }).optional(),
      })

      const validUser = {
        id: 1,
        username: 'johndoe',
        email: 'john@example.com',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          age: 30,
          bio: 'Software developer',
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en',
        },
      }

      expect(validator.test(validUser)).toBe(true)

      // Without optional bio
      const userWithoutBio = {
        id: 2,
        username: 'janedoe',
        email: 'jane@example.com',
        profile: {
          firstName: 'Jane',
          lastName: 'Doe',
          age: 25,
        },
      }

      expect(validator.test(userWithoutBio)).toBe(true)

      // Invalid email
      const invalidUser = {
        id: 3,
        username: 'invalid',
        email: 'not-an-email',
        profile: {
          firstName: 'Invalid',
          lastName: 'User',
          age: 30,
        },
      }

      expect(validator.test(invalidUser)).toBe(false)
    })

    test('should validate API request objects', () => {
      const validator = object({
        method: string(),
        url: string().url(),
        headers: object().optional(),
        body: object().optional(),
        timeout: number().min(0).optional(),
      })

      expect(validator.test({
        method: 'GET',
        url: 'https://api.example.com/users',
      })).toBe(true)

      expect(validator.test({
        method: 'POST',
        url: 'https://api.example.com/users',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        },
        body: {
          name: 'John',
          email: 'john@example.com',
        },
        timeout: 5000,
      })).toBe(true)

      // Invalid URL
      expect(validator.test({
        method: 'GET',
        url: 'not-a-url',
      })).toBe(false)

      // Negative timeout
      expect(validator.test({
        method: 'GET',
        url: 'https://api.example.com/users',
        timeout: -1,
      })).toBe(false)
    })

    test('should validate configuration objects', () => {
      const validator = object({
        database: object({
          host: string(),
          port: number().min(1).max(65535),
          username: string(),
          password: string(),
          name: string(),
        }),
        server: object({
          port: number().min(1).max(65535),
          host: string().optional(),
          ssl: boolean().optional(),
        }),
        logging: object({
          level: string(),
          file: string().optional(),
          console: boolean().optional(),
        }).optional(),
      })

      const validConfig = {
        database: {
          host: 'localhost',
          port: 5432,
          username: 'admin',
          password: 'secret',
          name: 'myapp',
        },
        server: {
          port: 3000,
          host: '0.0.0.0',
          ssl: true,
        },
        logging: {
          level: 'info',
          file: '/var/log/app.log',
          console: true,
        },
      }

      expect(validator.test(validConfig)).toBe(true)

      // Without optional logging
      const configWithoutLogging = {
        database: {
          host: 'localhost',
          port: 5432,
          username: 'admin',
          password: 'secret',
          name: 'myapp',
        },
        server: {
          port: 3000,
        },
      }

      expect(validator.test(configWithoutLogging)).toBe(true)

      // Invalid port
      const invalidConfig = {
        database: {
          host: 'localhost',
          port: 999999, // invalid port
          username: 'admin',
          password: 'secret',
          name: 'myapp',
        },
        server: {
          port: 3000,
        },
      }

      expect(validator.test(invalidConfig)).toBe(false)
    })
  })

  describe('edge cases', () => {
    test('should handle empty objects', () => {
      const validator = object()
      expect(validator.test({})).toBe(true)
    })

    test('should handle objects with null/undefined values', () => {
      const validator = object({
        name: string().optional(),
        age: number().optional(),
      })

      expect(validator.test({
        name: null,
        age: undefined,
      })).toBe(true)

      expect(validator.test({
        name: 'John',
        age: null,
      })).toBe(true)
    })

    test('should handle objects with array properties', () => {
      const validator = object({
        name: string(),
        tags: object(), // Arrays are objects in JavaScript, but our validator rejects them
      })

      // Arrays are actually rejected by our object validator since it checks !Array.isArray(value)
      expect(validator.test({
        name: 'John',
        tags: ['developer', 'javascript'],
      })).toBe(false) // Arrays are not plain objects

      expect(validator.test({
        name: 'John',
        tags: { primary: 'developer', secondary: 'javascript' },
      })).toBe(true)
    })

    test('should handle deeply nested objects', () => {
      const validator = object({
        level1: object({
          level2: object({
            level3: object({
              value: string(),
            }),
          }),
        }),
      })

      expect(validator.test({
        level1: {
          level2: {
            level3: {
              value: 'deep',
            },
          },
        },
      })).toBe(true)

      expect(validator.test({
        level1: {
          level2: {
            level3: {
              value: 123, // wrong type
            },
          },
        },
      } as any)).toBe(false)
    })

    test('should handle objects with special property names', () => {
      const validator = object({
        'kebab-case': string(),
        'snake_case': string(),
        'camelCase': string(),
        'PascalCase': string(),
        '123numeric': string(),
        'with spaces': string(),
        'with.dots': string(),
      })

      expect(validator.test({
        'kebab-case': 'value1',
        'snake_case': 'value2',
        'camelCase': 'value3',
        'PascalCase': 'value4',
        '123numeric': 'value5',
        'with spaces': 'value6',
        'with.dots': 'value7',
      })).toBe(true)
    })

    test('should handle objects with symbol properties', () => {
      const validator = object()
      const symbol = Symbol('test')
      const objWithSymbol = {
        name: 'John',
        [symbol]: 'symbol value',
      }

      expect(validator.test(objWithSymbol)).toBe(true)
    })

    test('should handle prototype pollution attempts', () => {
      const validator = object({
        name: string(),
      })

      const maliciousObject = {
        name: 'John',
        __proto__: {
          polluted: true,
        },
      }

      // Should still validate the object structure
      expect(validator.test(maliciousObject)).toBe(true)
    })
  })

  describe('validation results', () => {
    test('should return detailed validation results', () => {
      const validator = object({
        name: string(),
        age: number(),
      })

      const result = validator.validate({
        name: 'John',
        age: 'thirty', // wrong type
      } as any)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(false) // errors is an object map for object validators
      expect(typeof result.errors).toBe('object')
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    })

    test('should return success for valid objects', () => {
      const validator = object({
        name: string(),
        age: number(),
      })

      const result = validator.validate({
        name: 'John',
        age: 30,
      })

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([]) // errors is an empty array for valid results
    })

    test('should return multiple errors for multiple failed validations', () => {
      const validator = object({
        name: string(),
        age: number(),
        email: string().email(),
      })

      const result = validator.validate({
        name: 123, // wrong type
        age: 'thirty', // wrong type
        email: 'not-an-email', // invalid format
      } as any)

      expect(result.valid).toBe(false)
      expect(Array.isArray(result.errors)).toBe(false) // errors is an object map for object validators
      expect(typeof result.errors).toBe('object')
      expect(Object.keys(result.errors).length).toBeGreaterThan(1)
    })
  })

  describe('chaining validations', () => {
    test('should chain all validation methods', () => {
      const validator = object({
        name: string(),
        age: number(),
      })
        .required()
        .strict()
        .custom(obj => obj.age >= 18, 'Must be 18 or older')

      const validObject = {
        name: 'John',
        age: 25,
      }

      const tooYoung = {
        name: 'Jane',
        age: 17,
      }

      const withExtra = {
        name: 'Bob',
        age: 25,
        extra: 'property',
      }

      expect(validator.test(validObject)).toBe(true)
      expect(validator.test(tooYoung)).toBe(false) // custom validation
      expect(validator.test(withExtra)).toBe(false) // strict validation
      expect(validator.test(null as any)).toBe(false) // required
    })
  })

  describe('type safety', () => {
    test('should work with complex nested types', () => {
      const validator = object({
        user: object({
          id: number(),
          profile: object({
            name: string(),
            settings: object({
              theme: string(),
              notifications: boolean(),
            }),
          }),
        }),
      })

      const validData = {
        user: {
          id: 1,
          profile: {
            name: 'John',
            settings: {
              theme: 'dark',
              notifications: true,
            },
          },
        },
      }

      expect(validator.test(validData)).toBe(true)
    })

    test('should maintain type information for validated objects', () => {
      const validator = object({
        name: string(),
        age: number(),
        active: boolean(),
      })

      // TypeScript would ensure the object matches the expected shape
      const validObject = {
        name: 'John',
        age: 30,
        active: true,
      }

      expect(validator.test(validObject)).toBe(true)
    })
  })
})
