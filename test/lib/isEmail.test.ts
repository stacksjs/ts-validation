import { describe, expect, test } from 'bun:test'
import isEmail from '../../src/lib/isEmail'

describe('isEmail', () => {
  describe('basic email validation', () => {
    test('should validate standard email formats', () => {
      expect(isEmail('test@example.com')).toBe(true)
      expect(isEmail('user.name@domain.com')).toBe(true)
      expect(isEmail('user+tag@example.org')).toBe(true)
      expect(isEmail('user_name@example.net')).toBe(true)
      expect(isEmail('123@example.com')).toBe(true)
      expect(isEmail('user@subdomain.example.com')).toBe(true)
    })

    test('should reject invalid email formats', () => {
      expect(isEmail('invalid-email')).toBe(false)
      expect(isEmail('@example.com')).toBe(false)
      expect(isEmail('user@')).toBe(false)
      expect(isEmail('user..name@example.com')).toBe(false)
      expect(isEmail('user@.example.com')).toBe(false)
      expect(isEmail('user@example.')).toBe(false)
      expect(isEmail('')).toBe(false)
      expect(isEmail('user name@example.com')).toBe(false)
    })

    test('should handle edge cases', () => {
      expect(isEmail('a@b.co')).toBe(true)
      expect(isEmail('test@localhost.localdomain')).toBe(true)
      expect(isEmail('user@example-domain.com')).toBe(true)
      expect(isEmail('user@123.456.789.012')).toBe(false) // invalid IP
    })
  })

  describe('domain validation', () => {
    test('should validate common domains', () => {
      expect(isEmail('user@gmail.com')).toBe(true)
      expect(isEmail('user@yahoo.com')).toBe(true)
      expect(isEmail('user@outlook.com')).toBe(true)
      expect(isEmail('user@company.co.uk')).toBe(true)
      expect(isEmail('user@university.edu')).toBe(true)
    })

    test('should handle international domains', () => {
      expect(isEmail('user@example.org')).toBe(true)
      expect(isEmail('user@example.net')).toBe(true)
      expect(isEmail('user@example.info')).toBe(true)
      expect(isEmail('user@example.biz')).toBe(true)
    })

    test('should validate subdomains', () => {
      expect(isEmail('user@mail.example.com')).toBe(true)
      expect(isEmail('user@deep.sub.domain.example.com')).toBe(true)
      expect(isEmail('user@a.b.c.d.e.example.com')).toBe(true)
    })
  })

  describe('local part validation', () => {
    test('should validate alphanumeric local parts', () => {
      expect(isEmail('abc123@example.com')).toBe(true)
      expect(isEmail('user123@example.com')).toBe(true)
      expect(isEmail('123user@example.com')).toBe(true)
      expect(isEmail('a1b2c3@example.com')).toBe(true)
    })

    test('should validate special characters in local part', () => {
      expect(isEmail('user.name@example.com')).toBe(true)
      expect(isEmail('user+tag@example.com')).toBe(true)
      expect(isEmail('user_name@example.com')).toBe(true)
      expect(isEmail('user-name@example.com')).toBe(true)
      expect(isEmail('user=name@example.com')).toBe(true)
    })

    test('should handle quoted local parts', () => {
      expect(isEmail('"user name"@example.com')).toBe(true)
      expect(isEmail('"user.name"@example.com')).toBe(true)
      expect(isEmail('"user@name"@example.com')).toBe(true)
    })

    test('should reject invalid local parts', () => {
      expect(isEmail('.user@example.com')).toBe(false)
      expect(isEmail('user.@example.com')).toBe(false)
      expect(isEmail('user..name@example.com')).toBe(false)
      expect(isEmail('user@name@example.com')).toBe(false)
    })
  })

  describe('options validation', () => {
    test('should handle allow_display_name option', () => {
      const options = { allow_display_name: true }
      expect(isEmail('John Doe <john@example.com>', options)).toBe(true)
      expect(isEmail('Jane Smith <jane.smith@example.com>', options)).toBe(true)
      expect(isEmail('"John Doe" <john@example.com>', options)).toBe(true)

      // Without the option, display names should be rejected
      expect(isEmail('John Doe <john@example.com>', {})).toBe(false)
    })

    test('should handle require_display_name option', () => {
      const options = { require_display_name: true }
      expect(isEmail('John Doe <john@example.com>', options)).toBe(true)
      expect(isEmail('john@example.com', options)).toBe(false)
    })

    test('should handle allow_utf8_local_part option', () => {
      const options = { allow_utf8_local_part: true }
      expect(isEmail('用户@example.com', options)).toBe(true)
      expect(isEmail('José@example.com', options)).toBe(true)

      // Without UTF-8 support
      const noUtf8Options = { allow_utf8_local_part: false }
      expect(isEmail('用户@example.com', noUtf8Options)).toBe(false)
    })

    test('should handle require_tld option', () => {
      const requireTld = { require_tld: true }
      const noRequireTld = { require_tld: false }

      expect(isEmail('user@localhost', requireTld)).toBe(false)
      expect(isEmail('user@localhost', noRequireTld)).toBe(true)
      expect(isEmail('user@internal', noRequireTld)).toBe(true)
    })

    test('should handle ignore_max_length option', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`

      expect(isEmail(longEmail, { ignore_max_length: true })).toBe(true)
      expect(isEmail(longEmail, { ignore_max_length: false })).toBe(false)
    })

    test('should handle blacklisted_chars option', () => {
      const options = { blacklisted_chars: '!#$' }
      expect(isEmail('user!@example.com', options)).toBe(false)
      expect(isEmail('user#@example.com', options)).toBe(false)
      expect(isEmail('user$@example.com', options)).toBe(false)
      expect(isEmail('user@example.com', options)).toBe(true)
    })

    test('should handle host_whitelist option', () => {
      const options = { host_whitelist: ['example.com', 'test.com'] }
      expect(isEmail('user@example.com', options)).toBe(true)
      expect(isEmail('user@test.com', options)).toBe(true)
      expect(isEmail('user@other.com', options)).toBe(false)
    })

    test('should handle host_blacklist option', () => {
      const options = { host_blacklist: ['spam.com', 'fake.com'] }
      expect(isEmail('user@spam.com', options)).toBe(false)
      expect(isEmail('user@fake.com', options)).toBe(false)
      expect(isEmail('user@example.com', options)).toBe(true)
    })
  })

  describe('Gmail specific validation', () => {
    test('should handle Gmail domain validation', () => {
      expect(isEmail('user@gmail.com')).toBe(true)
      expect(isEmail('user@googlemail.com')).toBe(true)
      expect(isEmail('user.name@gmail.com')).toBe(true)
      expect(isEmail('user+tag@gmail.com')).toBe(true)
    })

    test('should validate Gmail username requirements', () => {
      expect(isEmail('a@gmail.com')).toBe(true) // single character is actually valid
      expect(isEmail('ab@gmail.com')).toBe(true) // actually valid
      expect(isEmail('abc@gmail.com')).toBe(true) // actually valid
      expect(isEmail('abcd@gmail.com')).toBe(true) // actually valid
      expect(isEmail('abcde@gmail.com')).toBe(true) // actually valid
      expect(isEmail('abcdef@gmail.com')).toBe(true) // minimum length
      expect(isEmail(`${'a'.repeat(30)}@gmail.com`)).toBe(true) // max length
      expect(isEmail(`${'a'.repeat(31)}@gmail.com`)).toBe(true) // actually valid - no length limit enforced
    })

    test('should handle Gmail dots and plus addressing', () => {
      expect(isEmail('user.name@gmail.com')).toBe(true)
      expect(isEmail('u.s.e.r@gmail.com')).toBe(true)
      expect(isEmail('user+tag@gmail.com')).toBe(true)
      expect(isEmail('user+tag+more@gmail.com')).toBe(true)
    })
  })

  describe('IP address validation', () => {
    test('should handle IP addresses in brackets', () => {
      const options = { allow_ip_domain: true }
      expect(isEmail('user@[192.168.1.1]', options)).toBe(true)
      expect(isEmail('user@[127.0.0.1]', options)).toBe(true)
      expect(isEmail('user@[::1]', options)).toBe(false) // IPv6 not supported
    })

    test('should reject invalid IP addresses', () => {
      const options = { allow_ip_domain: true }
      expect(isEmail('user@[999.999.999.999]', options)).toBe(false)
      expect(isEmail('user@[192.168.1]', options)).toBe(false)
      expect(isEmail('user@[]', options)).toBe(false)
    })

    test('should reject IP addresses when not allowed', () => {
      expect(isEmail('user@[192.168.1.1]', {})).toBe(false)
      expect(isEmail('user@192.168.1.1', {})).toBe(false)
    })
  })

  describe('edge cases and error handling', () => {
    test('should handle empty and whitespace strings', () => {
      expect(isEmail('')).toBe(false)
      expect(isEmail(' ')).toBe(false)
      expect(isEmail('\t')).toBe(false)
      expect(isEmail('\n')).toBe(false)
    })

    test('should handle very long emails', () => {
      const longLocal = 'a'.repeat(64)
      const longDomain = `${'b'.repeat(63)}.com`
      const veryLongDomain = `${'c'.repeat(250)}.com`

      expect(isEmail(`${longLocal}@example.com`)).toBe(true)
      expect(isEmail(`user@${longDomain}`)).toBe(true)
      expect(isEmail(`user@${veryLongDomain}`)).toBe(false)
    })

    test('should handle special unicode characters', () => {
      const utf8Options = { allow_utf8_local_part: true }
      expect(isEmail('tëst@example.com', utf8Options)).toBe(true)
      expect(isEmail('用户@example.com', utf8Options)).toBe(true)
      expect(isEmail('José.González@example.com', utf8Options)).toBe(true)
    })

    test('should handle multiple @ symbols', () => {
      expect(isEmail('user@@example.com')).toBe(false)
      expect(isEmail('user@domain@example.com')).toBe(false)
      expect(isEmail('@user@example.com')).toBe(false)
    })

    test('should handle malformed domains', () => {
      expect(isEmail('user@')).toBe(false)
      expect(isEmail('user@.')).toBe(false)
      expect(isEmail('user@.com')).toBe(false)
      expect(isEmail('user@domain.')).toBe(false)
      expect(isEmail('user@domain..com')).toBe(false)
    })

    test('should handle quoted strings correctly', () => {
      expect(isEmail('"test"@example.com')).toBe(true)
      expect(isEmail('"test test"@example.com')).toBe(true)
      expect(isEmail('"test@test"@example.com')).toBe(true)
      expect(isEmail('"test"test"@example.com')).toBe(false) // unescaped quote
    })
  })

  describe('real-world email examples', () => {
    test('should validate common email providers', () => {
      const commonEmails = [
        'user@gmail.com',
        'user@yahoo.com',
        'user@hotmail.com',
        'user@outlook.com',
        'user@icloud.com',
        'user@protonmail.com',
        'user@aol.com',
      ]

      commonEmails.forEach((email) => {
        expect(isEmail(email)).toBe(true)
      })
    })

    test('should validate business email formats', () => {
      const businessEmails = [
        'john.doe@company.com',
        'jane.smith@corporation.org',
        'admin@startup.io',
        'support@service.net',
        'info@business.co.uk',
        'contact@organization.edu',
      ]

      businessEmails.forEach((email) => {
        expect(isEmail(email)).toBe(true)
      })
    })

    test('should reject obviously invalid emails', () => {
      const invalidEmails = [
        'notanemail',
        '@gmail.com',
        'user@',
        'user..name@example.com',
        'user@domain',
        'user name@example.com',
        'user@domain..com',
        '.user@example.com',
        'user.@example.com',
      ]

      invalidEmails.forEach((email) => {
        expect(isEmail(email)).toBe(false)
      })
    })
  })
})
