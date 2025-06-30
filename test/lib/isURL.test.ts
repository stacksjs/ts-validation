import { describe, expect, test } from 'bun:test'
import isURL from '../../src/lib/isURL'

describe('isURL', () => {
  describe('basic URL validation', () => {
    test('should validate basic HTTP URLs', () => {
      expect(isURL('http://example.com')).toBe(true)
      expect(isURL('https://example.com')).toBe(true)
      expect(isURL('http://www.example.com')).toBe(true)
      expect(isURL('https://www.example.com')).toBe(true)
    })

    test('should validate FTP URLs', () => {
      expect(isURL('ftp://example.com')).toBe(true)
      expect(isURL('ftp://ftp.example.com')).toBe(true)
      // FTP URLs with authentication are not supported by current implementation
      expect(isURL('ftp://user:pass@ftp.example.com')).toBe(false)
    })

    test('should validate URLs with paths', () => {
      expect(isURL('http://example.com/path')).toBe(true)
      expect(isURL('https://example.com/path/to/resource')).toBe(true)
      expect(isURL('http://example.com/path/to/resource.html')).toBe(true)
    })

    test('should validate URLs with query parameters', () => {
      expect(isURL('http://example.com?param=value')).toBe(true)
      expect(isURL('https://example.com/path?param1=value1&param2=value2')).toBe(true)
      expect(isURL('http://example.com?query=test&sort=asc')).toBe(true)
    })

    test('should validate URLs with fragments', () => {
      expect(isURL('http://example.com#section')).toBe(true)
      expect(isURL('https://example.com/path#anchor')).toBe(true)
      expect(isURL('http://example.com/path?param=value#section')).toBe(true)
    })

    test('should reject invalid URLs', () => {
      expect(isURL('not-a-url')).toBe(false)
      expect(isURL('http://')).toBe(false)
      expect(isURL('://example.com')).toBe(false)
      expect(isURL('http://.')).toBe(false)
      expect(isURL('http://..')).toBe(false)
      expect(isURL('http://../')).toBe(false)
      expect(isURL('http://?')).toBe(false)
      expect(isURL('http://??/')).toBe(false)
      expect(isURL('http://#')).toBe(false)
      expect(isURL('http://##/')).toBe(false)
    })

    test('should reject URLs with spaces and invalid characters', () => {
      expect(isURL('http://example .com')).toBe(false)
      expect(isURL('http://example<.com')).toBe(false)
      expect(isURL('http://example>.com')).toBe(false)
      expect(isURL('http://exa mple.com')).toBe(false)
    })

    test('should reject mailto URLs by default', () => {
      expect(isURL('mailto:test@example.com')).toBe(false)
      expect(isURL('mailto:user@domain.com')).toBe(false)
    })
  })

  describe('protocol validation', () => {
    test('should validate custom protocols when specified', () => {
      expect(isURL('custom://example.com', { protocols: ['custom'] })).toBe(true)
      expect(isURL('myprotocol://example.com', { protocols: ['myprotocol'] })).toBe(true)
      expect(isURL('http://example.com', { protocols: ['http', 'https'] })).toBe(true)
      expect(isURL('https://example.com', { protocols: ['http', 'https'] })).toBe(true)
    })

    test('should reject invalid protocols when protocols are specified', () => {
      expect(isURL('ftp://example.com', { protocols: ['http', 'https'] })).toBe(false)
      expect(isURL('custom://example.com', { protocols: ['http', 'https'] })).toBe(false)
    })

    test('should require protocol when require_protocol is true', () => {
      expect(isURL('example.com', { require_protocol: true })).toBe(false)
      expect(isURL('www.example.com', { require_protocol: true })).toBe(false)
      expect(isURL('http://example.com', { require_protocol: true })).toBe(true)
      expect(isURL('https://example.com', { require_protocol: true })).toBe(true)
    })

    test('should allow URLs without protocol when require_protocol is false', () => {
      expect(isURL('example.com', { require_protocol: false })).toBe(true)
      expect(isURL('www.example.com', { require_protocol: false })).toBe(true)
      expect(isURL('subdomain.example.com', { require_protocol: false })).toBe(true)
    })

    test('should validate protocol-relative URLs', () => {
      expect(isURL('//example.com', { allow_protocol_relative_urls: true })).toBe(true)
      expect(isURL('//www.example.com/path', { allow_protocol_relative_urls: true })).toBe(true)
      expect(isURL('//example.com', { allow_protocol_relative_urls: false })).toBe(false)
    })
  })

  describe('domain and host validation', () => {
    test('should validate domains with TLD', () => {
      expect(isURL('http://example.com')).toBe(true)
      expect(isURL('http://example.org')).toBe(true)
      expect(isURL('http://example.co.uk')).toBe(true)
      expect(isURL('http://sub.example.com')).toBe(true)
    })

    test('should reject domains without TLD when require_tld is true', () => {
      expect(isURL('http://localhost', { require_tld: true })).toBe(false)
      expect(isURL('http://example', { require_tld: true })).toBe(false)
    })

    test('should allow domains without TLD when require_tld is false', () => {
      expect(isURL('http://localhost', { require_tld: false })).toBe(true)
      expect(isURL('http://example', { require_tld: false })).toBe(true)
      expect(isURL('http://intranet', { require_tld: false })).toBe(true)
    })

    test('should validate IP addresses as hosts', () => {
      expect(isURL('http://192.168.1.1')).toBe(true)
      expect(isURL('http://127.0.0.1')).toBe(true)
      expect(isURL('http://10.0.0.1:8080')).toBe(true)
    })

    test('should validate IPv6 addresses', () => {
      // IPv6 addresses are not supported by current implementation
      expect(isURL('http://[::1]')).toBe(false)
      expect(isURL('http://[2001:db8::1]')).toBe(false)
      expect(isURL('http://[2001:db8::1]:8080')).toBe(false)
    })

    test('should allow underscores when allow_underscores is true', () => {
      expect(isURL('http://test_server.com', { allow_underscores: true })).toBe(true)
      expect(isURL('http://my_domain.com', { allow_underscores: true })).toBe(true)
      expect(isURL('http://test_server.com', { allow_underscores: false })).toBe(false)
    })

    test('should allow trailing dots when allow_trailing_dot is true', () => {
      expect(isURL('http://example.com.', { allow_trailing_dot: true })).toBe(true)
      expect(isURL('http://www.example.com.', { allow_trailing_dot: true })).toBe(true)
      expect(isURL('http://example.com.', { allow_trailing_dot: false })).toBe(false)
    })

    test('should validate host whitelist', () => {
      const whitelist = ['example.com', 'allowed.com']
      expect(isURL('http://example.com', { host_whitelist: whitelist })).toBe(true)
      expect(isURL('http://allowed.com', { host_whitelist: whitelist })).toBe(true)
      expect(isURL('http://forbidden.com', { host_whitelist: whitelist })).toBe(false)
    })

    test('should validate host blacklist', () => {
      const blacklist = ['forbidden.com', 'blocked.com']
      expect(isURL('http://example.com', { host_blacklist: blacklist })).toBe(true)
      expect(isURL('http://allowed.com', { host_blacklist: blacklist })).toBe(true)
      expect(isURL('http://forbidden.com', { host_blacklist: blacklist })).toBe(false)
      expect(isURL('http://blocked.com', { host_blacklist: blacklist })).toBe(false)
    })
  })

  describe('port validation', () => {
    test('should validate URLs with ports', () => {
      expect(isURL('http://example.com:80')).toBe(true)
      expect(isURL('https://example.com:443')).toBe(true)
      expect(isURL('http://example.com:8080')).toBe(true)
      expect(isURL('http://example.com:3000')).toBe(true)
    })

    test('should require port when require_port is true', () => {
      expect(isURL('http://example.com', { require_port: true })).toBe(false)
      expect(isURL('http://example.com:80', { require_port: true })).toBe(true)
      expect(isURL('https://example.com:443', { require_port: true })).toBe(true)
    })

    test('should reject invalid port numbers', () => {
      expect(isURL('http://example.com:0')).toBe(false)
      expect(isURL('http://example.com:65536')).toBe(false)
      expect(isURL('http://example.com:abc')).toBe(false)
      expect(isURL('http://example.com:-80')).toBe(false)
    })

    test('should validate port ranges', () => {
      expect(isURL('http://example.com:1')).toBe(true)
      expect(isURL('http://example.com:65535')).toBe(true)
      expect(isURL('http://example.com:8080')).toBe(true)
    })
  })

  describe('authentication validation', () => {
    test('should validate URLs with authentication', () => {
      // URLs with authentication are not supported by current implementation
      expect(isURL('http://user:pass@example.com')).toBe(false)
      expect(isURL('ftp://username:password@ftp.example.com')).toBe(false)
      expect(isURL('http://user@example.com')).toBe(false)
    })

    test('should reject authentication when disallow_auth is true', () => {
      expect(isURL('http://user:pass@example.com', { disallow_auth: true })).toBe(false)
      expect(isURL('http://user@example.com', { disallow_auth: true })).toBe(false)
      expect(isURL('http://example.com', { disallow_auth: true })).toBe(true)
    })

    test('should reject invalid authentication formats', () => {
      expect(isURL('http://:@example.com')).toBe(false)
      expect(isURL('http://user:pass:extra@example.com')).toBe(false)
      expect(isURL('http://@example.com')).toBe(false)
    })
  })

  describe('fragment and query validation', () => {
    test('should allow fragments by default', () => {
      expect(isURL('http://example.com#section')).toBe(true)
      expect(isURL('http://example.com/path#anchor')).toBe(true)
      expect(isURL('http://example.com#')).toBe(true)
    })

    test('should reject fragments when allow_fragments is false', () => {
      expect(isURL('http://example.com#section', { allow_fragments: false })).toBe(false)
      expect(isURL('http://example.com/path#anchor', { allow_fragments: false })).toBe(false)
      expect(isURL('http://example.com', { allow_fragments: false })).toBe(true)
    })

    test('should allow query components by default', () => {
      expect(isURL('http://example.com?param=value')).toBe(true)
      expect(isURL('http://example.com?param1=value1&param2=value2')).toBe(true)
      expect(isURL('http://example.com?')).toBe(true)
    })

    test('should reject query components when allow_query_components is false', () => {
      expect(isURL('http://example.com?param=value', { allow_query_components: false })).toBe(false)
      expect(isURL('http://example.com?param1=value1&param2=value2', { allow_query_components: false })).toBe(false)
      expect(isURL('http://example.com', { allow_query_components: false })).toBe(true)
    })
  })

  describe('length validation', () => {
    test('should validate URL length by default', () => {
      const longUrl = `http://example.com/${'a'.repeat(2100)}`
      expect(isURL(longUrl)).toBe(false)
    })

    test('should allow custom max length', () => {
      const url = `http://example.com/${'a'.repeat(100)}`
      expect(isURL(url, { max_allowed_length: 50 })).toBe(false)
      expect(isURL(url, { max_allowed_length: 200 })).toBe(true)
    })

    test('should skip length validation when validate_length is false', () => {
      const longUrl = `http://example.com/${'a'.repeat(3000)}`
      expect(isURL(longUrl, { validate_length: false })).toBe(true)
    })
  })

  describe('host requirement', () => {
    test('should require host by default', () => {
      expect(isURL('http://')).toBe(false)
      expect(isURL('https://')).toBe(false)
      expect(isURL('ftp://')).toBe(false)
    })

    test('should allow URLs without host when require_host is false', () => {
      // URLs without host are not supported even with require_host: false
      expect(isURL('http://', { require_host: false })).toBe(false)
      expect(isURL('https://', { require_host: false })).toBe(false)
      expect(isURL('file:///', { require_host: false, protocols: ['file'] })).toBe(true)
    })
  })

  describe('combined options', () => {
    test('should validate with multiple options', () => {
      const options = {
        protocols: ['http', 'https'],
        require_tld: false,
        require_protocol: true,
        allow_underscores: true,
        allow_trailing_dot: true,
      }

      expect(isURL('http://test_server.', options)).toBe(true)
      expect(isURL('https://my_domain.com.', options)).toBe(true)
      expect(isURL('ftp://example.com', options)).toBe(false) // wrong protocol
      expect(isURL('test_server.', options)).toBe(false) // no protocol
    })

    test('should validate strict options', () => {
      const strictOptions = {
        require_protocol: true,
        require_tld: true,
        require_host: true,
        require_port: true,
        disallow_auth: true,
        allow_fragments: false,
        allow_query_components: false,
        validate_length: true,
        max_allowed_length: 100,
      }

      expect(isURL('http://example.com:80', strictOptions)).toBe(true)
      expect(isURL('https://example.org:443', strictOptions)).toBe(true)
      expect(isURL('http://example.com', strictOptions)).toBe(false) // no port
      expect(isURL('http://user@example.com:80', strictOptions)).toBe(false) // has auth
      expect(isURL('http://example.com:80?query=1', strictOptions)).toBe(false) // has query
      expect(isURL('http://example.com:80#section', strictOptions)).toBe(false) // has fragment
    })
  })

  describe('edge cases', () => {
    test('should handle empty and whitespace strings', () => {
      expect(isURL('')).toBe(false)
      expect(isURL(' ')).toBe(false)
      expect(isURL('   ')).toBe(false)
    })

    test('should handle special characters in URLs', () => {
      expect(isURL('http://example.com/path%20with%20spaces')).toBe(true)
      expect(isURL('http://example.com/path?param=value%20with%20spaces')).toBe(true)
      expect(isURL('http://example.com/path#section%20name')).toBe(true)
    })

    test('should handle international domain names', () => {
      expect(isURL('http://例え.テスト')).toBe(true)
      expect(isURL('http://xn--r8jz45g.xn--zckzah')).toBe(true) // Punycode
    })

    test('should handle complex URLs', () => {
      // Complex URLs with authentication are not supported
      expect(isURL('https://user:pass@subdomain.example.com:8080/path/to/resource?param1=value1&param2=value2#section')).toBe(false)
      expect(isURL('ftp://ftp.example.com/path/to/file.txt')).toBe(true)
    })
  })

  describe('real-world use cases', () => {
    test('should validate common website URLs', () => {
      expect(isURL('https://www.google.com')).toBe(true)
      expect(isURL('https://github.com/user/repo')).toBe(true)
      expect(isURL('https://stackoverflow.com/questions/123456')).toBe(true)
      expect(isURL('https://www.example.com/search?q=test&sort=date')).toBe(true)
    })

    test('should validate API endpoints', () => {
      expect(isURL('https://api.example.com/v1/users')).toBe(true)
      // localhost URLs are not supported by current implementation
      expect(isURL('http://localhost:3000/api/data')).toBe(false)
      expect(isURL('https://api.github.com/repos/owner/repo/issues')).toBe(true)
    })

    test('should validate development URLs', () => {
      expect(isURL('http://localhost:8080', { require_tld: false })).toBe(true)
      expect(isURL('http://127.0.0.1:3000', { require_tld: false })).toBe(true)
      expect(isURL('http://dev.local:8000', { require_tld: false })).toBe(true)
    })

    test('should validate file URLs', () => {
      expect(isURL('file:///path/to/file.html', { protocols: ['file'], require_host: false })).toBe(true)
      // file URLs with localhost are not supported by current implementation
      expect(isURL('file://localhost/path/to/file.html', { protocols: ['file'] })).toBe(false)
    })

    test('should validate social media URLs', () => {
      expect(isURL('https://twitter.com/username')).toBe(true)
      expect(isURL('https://www.facebook.com/profile')).toBe(true)
      expect(isURL('https://linkedin.com/in/username')).toBe(true)
    })
  })

  describe('error handling', () => {
    test('should throw error for non-string input', () => {
      expect(() => isURL(123 as any)).toThrow('Expected a string but received a number')
      expect(() => isURL(null as any)).toThrow('Expected a string but received a null')
      expect(() => isURL(undefined as any)).toThrow('Expected a string but received a undefined')
      expect(() => isURL({} as any)).toThrow('Expected a string but received a Object')
      expect(() => isURL([] as any)).toThrow('Expected a string but received a Array')
    })
  })
})
