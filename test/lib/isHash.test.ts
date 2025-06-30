import { describe, expect, test } from 'bun:test'
import isHash from '../../src/lib/isHash'

describe('isHash', () => {
  describe('MD5 hashes', () => {
    test('should validate correct MD5 hashes', () => {
      expect(isHash('5d41402abc4b2a76b9719d911017c592', 'md5')).toBe(true)
      expect(isHash('098f6bcd4621d373cade4e832627b4f6', 'md5')).toBe(true)
      expect(isHash('d41d8cd98f00b204e9800998ecf8427e', 'md5')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890', 'md5')).toBe(true)
      expect(isHash('abcdef1234567890abcdef1234567890', 'md5')).toBe(true)
    })

    test('should reject invalid MD5 hashes', () => {
      expect(isHash('5d41402abc4b2a76b9719d911017c59', 'md5')).toBe(false) // too short
      expect(isHash('5d41402abc4b2a76b9719d911017c5921', 'md5')).toBe(false) // too long
      expect(isHash('5d41402abc4b2a76b9719d911017c59g', 'md5')).toBe(false) // invalid char
      expect(isHash('', 'md5')).toBe(false) // empty
      expect(isHash('hello world', 'md5')).toBe(false) // not hex
    })
  })

  describe('MD4 hashes', () => {
    test('should validate correct MD4 hashes', () => {
      expect(isHash('31d6cfe0d16ae931b73c59d7e0c089c0', 'md4')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890', 'md4')).toBe(true)
      expect(isHash('1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d', 'md4')).toBe(true)
    })

    test('should reject invalid MD4 hashes', () => {
      expect(isHash('31d6cfe0d16ae931b73c59d7e0c089c', 'md4')).toBe(false) // too short
      expect(isHash('31d6cfe0d16ae931b73c59d7e0c089c01', 'md4')).toBe(false) // too long
      expect(isHash('31d6cfe0d16ae931b73c59d7e0c089cg', 'md4')).toBe(false) // invalid char
    })
  })

  describe('SHA1 hashes', () => {
    test('should validate correct SHA1 hashes', () => {
      expect(isHash('356a192b7913b04c54574d18c28d46e6395428ab', 'sha1')).toBe(true)
      expect(isHash('da39a3ee5e6b4b0d3255bfef95601890afd80709', 'sha1')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890ABCDEF12', 'sha1')).toBe(true)
      expect(isHash('1234567890abcdef1234567890abcdef12345678', 'sha1')).toBe(true)
    })

    test('should reject invalid SHA1 hashes', () => {
      expect(isHash('356a192b7913b04c54574d18c28d46e6395428a', 'sha1')).toBe(false) // too short
      expect(isHash('356a192b7913b04c54574d18c28d46e6395428abb', 'sha1')).toBe(false) // too long
      expect(isHash('356a192b7913b04c54574d18c28d46e6395428ag', 'sha1')).toBe(false) // invalid char
    })
  })

  describe('SHA256 hashes', () => {
    test('should validate correct SHA256 hashes', () => {
      expect(isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'sha256')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890', 'sha256')).toBe(true)
      expect(isHash('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'sha256')).toBe(true)
    })

    test('should reject invalid SHA256 hashes', () => {
      expect(isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85', 'sha256')).toBe(false) // too short
      expect(isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551', 'sha256')).toBe(false) // too long
      expect(isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b85g', 'sha256')).toBe(false) // invalid char
    })
  })

  describe('SHA384 hashes', () => {
    test('should validate correct SHA384 hashes', () => {
      const validSha384 = '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'
      expect(isHash(validSha384, 'sha384')).toBe(true)
      expect(isHash(validSha384.toUpperCase(), 'sha384')).toBe(true)
    })

    test('should reject invalid SHA384 hashes', () => {
      const shortHash = '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95'
      const longHash = '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95bb'
      const invalidHash = '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95g'

      expect(isHash(shortHash, 'sha384')).toBe(false) // too short
      expect(isHash(longHash, 'sha384')).toBe(false) // too long
      expect(isHash(invalidHash, 'sha384')).toBe(false) // invalid char
    })
  })

  describe('SHA512 hashes', () => {
    test('should validate correct SHA512 hashes', () => {
      const validSha512 = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'
      expect(isHash(validSha512, 'sha512')).toBe(true)
      expect(isHash(validSha512.toUpperCase(), 'sha512')).toBe(true)
    })

    test('should reject invalid SHA512 hashes', () => {
      const shortHash = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3'
      const longHash = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3ee'
      const invalidHash = 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3g'

      expect(isHash(shortHash, 'sha512')).toBe(false) // too short
      expect(isHash(longHash, 'sha512')).toBe(false) // too long
      expect(isHash(invalidHash, 'sha512')).toBe(false) // invalid char
    })
  })

  describe('RIPEMD hashes', () => {
    test('should validate RIPEMD128 hashes', () => {
      expect(isHash('cdf26213a150dc3ecb610f18f6b38b46', 'ripemd128')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890', 'ripemd128')).toBe(true)
    })

    test('should validate RIPEMD160 hashes', () => {
      expect(isHash('9c1185a5c5e9fc54612808977ee8f548b2258d31', 'ripemd160')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890ABCDEF12', 'ripemd160')).toBe(true)
    })

    test('should reject invalid RIPEMD hashes', () => {
      expect(isHash('cdf26213a150dc3ecb610f18f6b38b4', 'ripemd128')).toBe(false) // too short
      expect(isHash('9c1185a5c5e9fc54612808977ee8f548b2258d3', 'ripemd160')).toBe(false) // too short
    })
  })

  describe('Tiger hashes', () => {
    test('should validate Tiger128 hashes', () => {
      expect(isHash('3293ac630c13f0245f92bbb1766e1616', 'tiger128')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890', 'tiger128')).toBe(true)
    })

    test('should validate Tiger160 hashes', () => {
      expect(isHash('3293ac630c13f0245f92bbb1766e16167a4e5849', 'tiger160')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890ABCDEF12', 'tiger160')).toBe(true)
    })

    test('should validate Tiger192 hashes', () => {
      expect(isHash('3293ac630c13f0245f92bbb1766e16167a4e58492dde73f3', 'tiger192')).toBe(true)
      expect(isHash('ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890', 'tiger192')).toBe(true)
    })

    test('should reject invalid Tiger hashes', () => {
      expect(isHash('3293ac630c13f0245f92bbb1766e161', 'tiger128')).toBe(false) // too short
      expect(isHash('3293ac630c13f0245f92bbb1766e16167a4e584', 'tiger160')).toBe(false) // too short
      expect(isHash('3293ac630c13f0245f92bbb1766e16167a4e58492dde73f', 'tiger192')).toBe(false) // too short
    })
  })

  describe('CRC hashes', () => {
    test('should validate CRC32 hashes', () => {
      expect(isHash('00000000', 'crc32')).toBe(true)
      expect(isHash('FFFFFFFF', 'crc32')).toBe(true)
      expect(isHash('12345678', 'crc32')).toBe(true)
      expect(isHash('abcdef12', 'crc32')).toBe(true)
    })

    test('should validate CRC32B hashes', () => {
      expect(isHash('00000000', 'crc32b')).toBe(true)
      expect(isHash('FFFFFFFF', 'crc32b')).toBe(true)
      expect(isHash('12345678', 'crc32b')).toBe(true)
      expect(isHash('abcdef12', 'crc32b')).toBe(true)
    })

    test('should reject invalid CRC hashes', () => {
      expect(isHash('0000000', 'crc32')).toBe(false) // too short
      expect(isHash('000000000', 'crc32')).toBe(false) // too long
      expect(isHash('0000000g', 'crc32')).toBe(false) // invalid char
      expect(isHash('0000000', 'crc32b')).toBe(false) // too short
      expect(isHash('000000000', 'crc32b')).toBe(false) // too long
      expect(isHash('0000000g', 'crc32b')).toBe(false) // invalid char
    })
  })

  describe('edge cases', () => {
    test('should handle mixed case hashes', () => {
      expect(isHash('AbCdEf1234567890AbCdEf1234567890', 'md5')).toBe(true)
      expect(isHash('AbCdEf1234567890AbCdEf1234567890AbCdEf12', 'sha1')).toBe(true)
    })

    test('should reject empty strings for all algorithms', () => {
      expect(isHash('', 'md5')).toBe(false)
      expect(isHash('', 'sha1')).toBe(false)
      expect(isHash('', 'sha256')).toBe(false)
      expect(isHash('', 'sha384')).toBe(false)
      expect(isHash('', 'sha512')).toBe(false)
    })

    test('should reject non-hex characters', () => {
      expect(isHash('5d41402abc4b2a76b9719d911017c59g', 'md5')).toBe(false) // 'g' is not hex
      expect(isHash('5d41402abc4b2a76b9719d911017c59z', 'md5')).toBe(false) // 'z' is not hex
      expect(isHash('5d41402abc4b2a76b9719d911017c59!', 'md5')).toBe(false) // '!' is not hex
    })

    test('should reject spaces and special characters', () => {
      expect(isHash('5d41402a bc4b2a76b9719d911017c592', 'md5')).toBe(false) // space
      expect(isHash('5d41402a-bc4b2a76b9719d911017c592', 'md5')).toBe(false) // dash
      expect(isHash('5d41402a_bc4b2a76b9719d911017c592', 'md5')).toBe(false) // underscore
    })
  })

  describe('real world examples', () => {
    test('should validate common hash formats', () => {
      // Real MD5 hash of "hello"
      expect(isHash('5d41402abc4b2a76b9719d911017c592', 'md5')).toBe(true)

      // Real SHA1 hash of "hello"
      expect(isHash('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d', 'sha1')).toBe(true)

      // Real SHA256 hash of "hello"
      expect(isHash('2cf24dba4f21d4288094c4e0b39f57b5cb88b0ce4c6d9e5b7e3b2f6e1e2f0e8a', 'sha256')).toBe(true)
    })

    test('should handle password hashes from common systems', () => {
      // Common MD5 patterns
      expect(isHash('098f6bcd4621d373cade4e832627b4f6', 'md5')).toBe(true) // "test"
      expect(isHash('25d55ad283aa400af464c76d713c07ad', 'md5')).toBe(true) // "hello"
    })
  })

  describe('type validation', () => {
    test('should throw on non-string input', () => {
      expect(() => isHash(123 as any, 'md5')).toThrow()
      expect(() => isHash(null as any, 'md5')).toThrow()
      expect(() => isHash(undefined as any, 'md5')).toThrow()
      expect(() => isHash({} as any, 'md5')).toThrow()
      expect(() => isHash([] as any, 'md5')).toThrow()
      expect(() => isHash(true as any, 'md5')).toThrow()
    })
  })
})
