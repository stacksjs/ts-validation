import { describe, expect, test } from 'bun:test'
import isFullWidth from '../../src/lib/isFullWidth'

describe('isFullWidth', () => {
  describe('Full-width character validation', () => {
    test('should validate full-width characters', () => {
      expect(isFullWidth('こんにちは')).toBe(true) // Japanese hiragana
      expect(isFullWidth('カタカナ')).toBe(true) // Japanese katakana
      expect(isFullWidth('你好世界')).toBe(true) // Chinese characters
      expect(isFullWidth('안녕하세요')).toBe(true) // Korean characters
    })

    test('should validate full-width symbols', () => {
      expect(isFullWidth('！')).toBe(true) // Full-width exclamation
      expect(isFullWidth('？')).toBe(true) // Full-width question mark
      expect(isFullWidth('（）')).toBe(true) // Full-width parentheses
      expect(isFullWidth('【】')).toBe(true) // Full-width brackets
      expect(isFullWidth('，。')).toBe(true) // Full-width comma and period
    })

    test('should validate full-width numbers', () => {
      expect(isFullWidth('０１２３４')).toBe(true) // Full-width numbers
      expect(isFullWidth('５６７８９')).toBe(true) // Full-width numbers
    })

    test('should validate full-width letters', () => {
      expect(isFullWidth('ＡＢＣＤＥ')).toBe(true) // Full-width uppercase
      expect(isFullWidth('ａｂｃｄｅ')).toBe(true) // Full-width lowercase
    })

    test('should validate mixed full-width characters', () => {
      expect(isFullWidth('こんにちは世界')).toBe(true) // Mixed Japanese and Chinese
      expect(isFullWidth('日本語１２３')).toBe(true) // Japanese with full-width numbers
      expect(isFullWidth('ＡＢＣ日本語')).toBe(true) // Full-width letters with Japanese
    })
  })

  describe('Half-width character rejection', () => {
    test('should reject basic ASCII characters', () => {
      expect(isFullWidth('hello')).toBe(false) // Basic ASCII letters
      expect(isFullWidth('world')).toBe(false) // Basic ASCII letters
      expect(isFullWidth('12345')).toBe(false) // Regular numbers
      expect(isFullWidth('ABCDE')).toBe(false) // Regular uppercase
    })

    test('should reject ASCII symbols', () => {
      expect(isFullWidth('!')).toBe(false) // Regular exclamation
      expect(isFullWidth('?')).toBe(false) // Regular question mark
      expect(isFullWidth('()')).toBe(false) // Regular parentheses
      expect(isFullWidth('@#$%')).toBe(false) // Regular symbols
      expect(isFullWidth('.,;:')).toBe(false) // Regular punctuation
    })

    test('should reject half-width katakana', () => {
      expect(isFullWidth('ｱｲｳｴｵ')).toBe(false) // Half-width katakana
      expect(isFullWidth('ｶｷｸｹｺ')).toBe(false) // Half-width katakana
      expect(isFullWidth('ﾊﾋﾌﾍﾎ')).toBe(false) // Half-width katakana
    })

    test('should reject spaces', () => {
      expect(isFullWidth(' ')).toBe(false) // Regular space
      expect(isFullWidth('　')).toBe(true) // Full-width space (ideographic space)
    })
  })

  describe('Mixed content', () => {
    test('should validate strings with any full-width characters', () => {
      expect(isFullWidth('hello世界')).toBe(true) // Contains full-width characters
      expect(isFullWidth('123こんにちは')).toBe(true) // Contains full-width characters
      expect(isFullWidth('test！test')).toBe(true) // Contains full-width punctuation
    })

    test('should reject strings with only half-width characters', () => {
      expect(isFullWidth('hello world')).toBe(false) // Only half-width
      expect(isFullWidth('test123')).toBe(false) // Only half-width
      expect(isFullWidth('ABC!@#')).toBe(false) // Only half-width
    })

    test('should handle mixed scripts correctly', () => {
      expect(isFullWidth('English日本語')).toBe(true) // English + Japanese
      expect(isFullWidth('русский中文')).toBe(true) // Cyrillic + Chinese
      expect(isFullWidth('العربية한국어')).toBe(true) // Arabic + Korean
    })
  })

  describe('Unicode ranges', () => {
    test('should validate CJK characters', () => {
      // CJK Unified Ideographs
      expect(isFullWidth('一二三')).toBe(true)
      expect(isFullWidth('中国字')).toBe(true)
      expect(isFullWidth('漢字')).toBe(true)

      // CJK Compatibility Ideographs
      expect(isFullWidth('豈更車')).toBe(true)
    })

    test('should validate Hiragana and Katakana', () => {
      // Hiragana
      expect(isFullWidth('あいうえお')).toBe(true)
      expect(isFullWidth('かきくけこ')).toBe(true)

      // Katakana
      expect(isFullWidth('アイウエオ')).toBe(true)
      expect(isFullWidth('カキクケコ')).toBe(true)
    })

    test('should validate Hangul characters', () => {
      expect(isFullWidth('가나다')).toBe(true) // Hangul syllables
      expect(isFullWidth('한글')).toBe(true) // Korean word for Korean
      expect(isFullWidth('대한민국')).toBe(true) // South Korea
    })

    test('should validate full-width forms', () => {
      expect(isFullWidth('０１２')).toBe(true) // Full-width digits
      expect(isFullWidth('ＡＢＣ')).toBe(true) // Full-width Latin
      expect(isFullWidth('！＠＃')).toBe(true) // Full-width symbols
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(isFullWidth('')).toBe(false)
    })

    test('should handle single characters', () => {
      expect(isFullWidth('a')).toBe(false) // Half-width
      expect(isFullWidth('あ')).toBe(true) // Full-width
      expect(isFullWidth('1')).toBe(false) // Half-width number
      expect(isFullWidth('１')).toBe(true) // Full-width number
    })

    test('should handle whitespace', () => {
      expect(isFullWidth(' ')).toBe(false) // Regular space
      expect(isFullWidth('　')).toBe(true) // Ideographic space (full-width)
      expect(isFullWidth('\t')).toBe(true) // Tab is considered full-width by this function
      expect(isFullWidth('\n')).toBe(true) // Newline is considered full-width by this function
    })

    test('should handle special Unicode characters', () => {
      expect(isFullWidth('™')).toBe(true) // Trademark symbol
      expect(isFullWidth('©')).toBe(true) // Copyright symbol
      expect(isFullWidth('®')).toBe(true) // Registered trademark
      expect(isFullWidth('€')).toBe(true) // Euro symbol
    })
  })

  describe('Real-world use cases', () => {
    test('should validate Japanese text', () => {
      expect(isFullWidth('こんにちは世界')).toBe(true) // "Hello World" in Japanese
      expect(isFullWidth('私の名前は田中です')).toBe(true) // "My name is Tanaka"
      expect(isFullWidth('東京都')).toBe(true) // Tokyo
    })

    test('should validate Chinese text', () => {
      expect(isFullWidth('你好世界')).toBe(true) // "Hello World" in Chinese
      expect(isFullWidth('北京市')).toBe(true) // Beijing
      expect(isFullWidth('中华人民共和国')).toBe(true) // People's Republic of China
    })

    test('should validate Korean text', () => {
      expect(isFullWidth('안녕하세요')).toBe(true) // "Hello" in Korean
      expect(isFullWidth('대한민국')).toBe(true) // South Korea
      expect(isFullWidth('서울특별시')).toBe(true) // Seoul
    })

    test('should validate multilingual content', () => {
      expect(isFullWidth('Hello 世界')).toBe(true) // English + Chinese
      expect(isFullWidth('Bonjour こんにちは')).toBe(true) // French + Japanese
      expect(isFullWidth('Привет 안녕')).toBe(true) // Russian + Korean
    })

    test('should validate form input scenarios', () => {
      // Full-width input in forms (common in East Asian web forms)
      expect(isFullWidth('田中太郎')).toBe(true) // Japanese name
      expect(isFullWidth('东京都港区')).toBe(true) // Chinese address
      expect(isFullWidth('１２３－４５６７')).toBe(true) // Full-width phone number format
    })

    test('should handle mixed content validation', () => {
      // Content that mixes different writing systems
      expect(isFullWidth('iPhone１２')).toBe(true) // English brand + full-width number
      expect(isFullWidth('WiFi接続')).toBe(true) // English tech term + Japanese
      expect(isFullWidth('email@例え.com')).toBe(true) // Contains full-width characters
    })
  })

  describe('Input validation', () => {
    test('should throw error for non-string input', () => {
      expect(() => isFullWidth(null as any)).toThrow()
      expect(() => isFullWidth(undefined as any)).toThrow()
      expect(() => isFullWidth(123 as any)).toThrow()
      expect(() => isFullWidth([] as any)).toThrow()
      expect(() => isFullWidth({} as any)).toThrow()
    })
  })

  describe('Performance', () => {
    test('should be consistent across multiple calls', () => {
      const input = 'こんにちは世界'

      const result1 = isFullWidth(input)
      const result2 = isFullWidth(input)
      expect(result1).toBe(result2)
      expect(result1).toBe(true)
    })

    test('should handle long strings with mixed content', () => {
      const longMixed = `${'hello world '.repeat(100)}こんにちは世界`
      expect(isFullWidth(longMixed)).toBe(true) // Contains full-width characters

      const longHalfWidth = 'hello world '.repeat(100)
      expect(isFullWidth(longHalfWidth)).toBe(false) // Only half-width characters
    })
  })
})
