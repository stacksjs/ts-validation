import { describe, expect, test } from 'bun:test'
import isHalfWidth from '../../src/lib/isHalfWidth'

describe('isHalfWidth', () => {
  describe('Half-width character validation', () => {
    test('should validate basic ASCII characters', () => {
      expect(isHalfWidth('hello')).toBe(true) // Basic ASCII letters
      expect(isHalfWidth('world')).toBe(true) // Basic ASCII letters
      expect(isHalfWidth('12345')).toBe(true) // Regular numbers
      expect(isHalfWidth('ABCDE')).toBe(true) // Regular uppercase
    })

    test('should validate ASCII symbols', () => {
      expect(isHalfWidth('!')).toBe(true) // Regular exclamation
      expect(isHalfWidth('?')).toBe(true) // Regular question mark
      expect(isHalfWidth('()')).toBe(true) // Regular parentheses
      expect(isHalfWidth('@#$%')).toBe(true) // Regular symbols
      expect(isHalfWidth('.,;:')).toBe(true) // Regular punctuation
    })

    test('should validate half-width katakana', () => {
      expect(isHalfWidth('ｱｲｳｴｵ')).toBe(true) // Half-width katakana
      expect(isHalfWidth('ｶｷｸｹｺ')).toBe(true) // Half-width katakana
      expect(isHalfWidth('ﾊﾋﾌﾍﾎ')).toBe(true) // Half-width katakana
      expect(isHalfWidth('ﾏﾐﾑﾒﾓ')).toBe(true) // Half-width katakana
    })

    test('should validate spaces and whitespace', () => {
      expect(isHalfWidth(' ')).toBe(true) // Regular space
      expect(isHalfWidth('\t')).toBe(false) // Tab (not in range)
      expect(isHalfWidth('\n')).toBe(false) // Newline (not in range)
    })

    test('should validate mixed half-width characters', () => {
      expect(isHalfWidth('hello123')).toBe(true) // Letters + numbers
      expect(isHalfWidth('test!@#')).toBe(true) // Letters + symbols
      expect(isHalfWidth('ABC123!?')).toBe(true) // Mixed ASCII
      expect(isHalfWidth('ｱｲｳabc123')).toBe(true) // Half-width katakana + ASCII
    })
  })

  describe('Full-width character rejection', () => {
    test('should reject full-width characters', () => {
      expect(isHalfWidth('こんにちは')).toBe(false) // Japanese hiragana
      expect(isHalfWidth('カタカナ')).toBe(false) // Japanese katakana
      expect(isHalfWidth('你好世界')).toBe(false) // Chinese characters
      expect(isHalfWidth('안녕하세요')).toBe(false) // Korean characters
    })

    test('should reject full-width symbols', () => {
      expect(isHalfWidth('！')).toBe(false) // Full-width exclamation
      expect(isHalfWidth('？')).toBe(false) // Full-width question mark
      expect(isHalfWidth('（）')).toBe(false) // Full-width parentheses
      expect(isHalfWidth('【】')).toBe(false) // Full-width brackets
      expect(isHalfWidth('，。')).toBe(false) // Full-width comma and period
    })

    test('should reject full-width numbers', () => {
      expect(isHalfWidth('０１２３４')).toBe(false) // Full-width numbers
      expect(isHalfWidth('５６７８９')).toBe(false) // Full-width numbers
    })

    test('should reject full-width letters', () => {
      expect(isHalfWidth('ＡＢＣＤＥ')).toBe(false) // Full-width uppercase
      expect(isHalfWidth('ａｂｃｄｅ')).toBe(false) // Full-width lowercase
    })

    test('should reject ideographic space', () => {
      expect(isHalfWidth('　')).toBe(false) // Full-width space (ideographic space)
    })
  })

  describe('Mixed content', () => {
    test('should validate strings with any half-width characters', () => {
      expect(isHalfWidth('hello世界')).toBe(true) // Contains half-width characters
      expect(isHalfWidth('123こんにちは')).toBe(true) // Contains half-width characters
      expect(isHalfWidth('test！test')).toBe(true) // Contains half-width characters
    })

    test('should reject strings with only full-width characters', () => {
      expect(isHalfWidth('こんにちは世界')).toBe(false) // Only full-width
      expect(isHalfWidth('カタカナ文字')).toBe(false) // Only full-width
      expect(isHalfWidth('中文字符')).toBe(false) // Only full-width
    })

    test('should handle mixed scripts correctly', () => {
      expect(isHalfWidth('English日本語')).toBe(true) // English + Japanese
      expect(isHalfWidth('русский中文')).toBe(false) // Cyrillic + Chinese (Cyrillic not in half-width ranges)
      expect(isHalfWidth('test한국어')).toBe(true) // ASCII + Korean (ASCII is half-width)
    })
  })

  describe('Unicode ranges validation', () => {
    test('should validate ASCII range (U+0020-U+007E)', () => {
      expect(isHalfWidth(' ')).toBe(true) // U+0020 (space)
      expect(isHalfWidth('A')).toBe(true) // U+0041
      expect(isHalfWidth('z')).toBe(true) // U+007A
      expect(isHalfWidth('~')).toBe(true) // U+007E (tilde)
    })

    test('should validate half-width katakana range (U+FF61-U+FF9F)', () => {
      expect(isHalfWidth('｡')).toBe(true) // U+FF61 (half-width ideographic full stop)
      expect(isHalfWidth('ｱ')).toBe(true) // U+FF71 (half-width katakana A)
      expect(isHalfWidth('ﾝ')).toBe(true) // U+FF9D (half-width katakana N)
      expect(isHalfWidth('ﾟ')).toBe(true) // U+FF9F (half-width semi-voiced sound mark)
    })

    test('should validate additional ranges (U+FFA0-U+FFDC)', () => {
      expect(isHalfWidth('ﾠ')).toBe(true) // U+FFA0 (half-width hangul filler)
      expect(isHalfWidth('ￜ')).toBe(true) // U+FFDC (half-width hangul letter)
    })

    test('should validate currency symbols range (U+FFE8-U+FFEE)', () => {
      expect(isHalfWidth('￨')).toBe(true) // U+FFE8 (half-width forms light vertical)
      expect(isHalfWidth('￮')).toBe(true) // U+FFEE (half-width white circle)
    })

    test('should reject characters outside half-width ranges', () => {
      expect(isHalfWidth('\u0019')).toBe(false) // Below ASCII range
      expect(isHalfWidth('\u007F')).toBe(false) // Above ASCII range
      expect(isHalfWidth('\u3000')).toBe(false) // Ideographic space
      expect(isHalfWidth('\u30A0')).toBe(false) // Katakana-hiragana double hyphen
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isHalfWidth('')).toBe(false)
    })

    test('should handle single characters', () => {
      expect(isHalfWidth('a')).toBe(true) // Half-width
      expect(isHalfWidth('あ')).toBe(false) // Full-width
      expect(isHalfWidth('1')).toBe(true) // Half-width number
      expect(isHalfWidth('１')).toBe(false) // Full-width number
    })

    test('should handle control characters', () => {
      expect(isHalfWidth('\u0000')).toBe(false) // Null character
      expect(isHalfWidth('\u001F')).toBe(false) // Unit separator
      expect(isHalfWidth('\u007F')).toBe(false) // Delete character
    })

    test('should handle extended ASCII', () => {
      expect(isHalfWidth('\u0080')).toBe(false) // Euro sign area
      expect(isHalfWidth('\u00A0')).toBe(false) // Non-breaking space
      expect(isHalfWidth('\u00FF')).toBe(false) // Latin extended
    })
  })

  describe('Real-world use cases', () => {
    test('should validate English text', () => {
      expect(isHalfWidth('Hello World')).toBe(true)
      expect(isHalfWidth('The quick brown fox')).toBe(true)
      expect(isHalfWidth('JavaScript is awesome!')).toBe(true)
    })

    test('should validate programming code', () => {
      expect(isHalfWidth('function test() {}')).toBe(true)
      expect(isHalfWidth('const x = 42;')).toBe(true)
      expect(isHalfWidth('if (x > 0) return true;')).toBe(true)
      expect(isHalfWidth('console.log("hello");')).toBe(true)
    })

    test('should validate URLs and emails', () => {
      expect(isHalfWidth('https://example.com')).toBe(true)
      expect(isHalfWidth('user@domain.org')).toBe(true)
      expect(isHalfWidth('ftp://files.example.net/path')).toBe(true)
    })

    test('should validate numeric data', () => {
      expect(isHalfWidth('123.456')).toBe(true)
      expect(isHalfWidth('$1,234.56')).toBe(true)
      expect(isHalfWidth('+1-555-123-4567')).toBe(true)
      expect(isHalfWidth('2023-12-25')).toBe(true)
    })

    test('should validate half-width katakana text', () => {
      expect(isHalfWidth('ｱﾘｶﾞﾄｳｺﾞｻﾞｲﾏｽ')).toBe(true) // "Thank you very much" in half-width katakana
      expect(isHalfWidth('ｺﾝﾋﾟｭｰﾀｰ')).toBe(true) // "Computer" in half-width katakana
      expect(isHalfWidth('ｲﾝﾀｰﾈｯﾄ')).toBe(true) // "Internet" in half-width katakana
    })

    test('should handle mixed content validation', () => {
      // Content that includes half-width characters
      expect(isHalfWidth('iPhone12 発売')).toBe(true) // English + Japanese (contains half-width)
      expect(isHalfWidth('WiFi接続中...')).toBe(true) // English + Japanese (contains half-width)
      expect(isHalfWidth('email送信完了')).toBe(true) // English + Japanese (contains half-width)
    })

    test('should validate form input scenarios', () => {
      // Common form inputs that should contain half-width characters
      expect(isHalfWidth('john.doe@email.com')).toBe(true) // Email
      expect(isHalfWidth('555-0123')).toBe(true) // Phone number
      expect(isHalfWidth('ABC123XYZ')).toBe(true) // Product code
      expect(isHalfWidth('password123!')).toBe(true) // Password
    })
  })

  describe('Comparison with full-width', () => {
    test('should distinguish between half-width and full-width versions', () => {
      // Numbers
      expect(isHalfWidth('123')).toBe(true) // Half-width
      expect(isHalfWidth('１２３')).toBe(false) // Full-width

      // Letters
      expect(isHalfWidth('ABC')).toBe(true) // Half-width
      expect(isHalfWidth('ＡＢＣ')).toBe(false) // Full-width

      // Symbols
      expect(isHalfWidth('!@#')).toBe(true) // Half-width
      expect(isHalfWidth('！＠＃')).toBe(false) // Full-width

      // Spaces
      expect(isHalfWidth(' ')).toBe(true) // Half-width space
      expect(isHalfWidth('　')).toBe(false) // Full-width space
    })

    test('should handle text with both half-width and full-width', () => {
      expect(isHalfWidth('hello こんにちは')).toBe(true) // Contains half-width
      expect(isHalfWidth('123 ４５６')).toBe(true) // Contains half-width numbers
      expect(isHalfWidth('test! テスト！')).toBe(true) // Contains half-width punctuation
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isHalfWidth(null as any)).toThrow()
      expect(() => isHalfWidth(undefined as any)).toThrow()
      expect(() => isHalfWidth(123 as any)).toThrow()
      expect(() => isHalfWidth([] as any)).toThrow()
      expect(() => isHalfWidth({} as any)).toThrow()
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const input = 'hello world 123'

      const result1 = isHalfWidth(input)
      const result2 = isHalfWidth(input)
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })

    test('should handle long strings with mixed content', () => {
      const longMixed = `${'hello world '.repeat(100)}こんにちは世界`
      expect(isHalfWidth(longMixed)).toBe(true) // Contains half-width characters

      const longFullWidth = 'こんにちは世界'.repeat(100)
      expect(isHalfWidth(longFullWidth)).toBe(false) // Only full-width characters
    })

    test('should efficiently validate various character sets', () => {
      const testCases = [
        'ASCII text 123',
        'ｱｲｳｴｵ ｶﾀｶﾅ',
        'Mixed content: hello 世界',
        'Symbols: !@#$%^&*()',
        'Email: test@example.com',
      ]

      testCases.forEach((testCase) => {
        const result1 = isHalfWidth(testCase)
        const result2 = isHalfWidth(testCase)
        expect(result1).toBe(result2)
      })
    })
  })
})
