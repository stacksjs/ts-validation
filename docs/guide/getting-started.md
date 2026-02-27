# Getting Started

ts-validation is a comprehensive string validation and sanitization library for TypeScript, providing 80+ validators for common data types including emails, URLs, credit cards, phone numbers, and more.

## Installation

Install ts-validation using your preferred package manager:

```bash
# Using bun
bun add ts-validation

# Using npm
npm install ts-validation

# Using yarn
yarn add ts-validation

# Using pnpm
pnpm add ts-validation
```

## Basic Usage

Import the validator object or individual validators:

```typescript
// Import the validator object
import validator from 'ts-validation'

// Validate an email
validator.isEmail('test@example.com') // true
validator.isEmail('invalid-email') // false

// Validate a URL
validator.isURL('https://example.com') // true

// Validate a credit card
validator.isCreditCard('4111111111111111') // true
```

Or import individual validators:

```typescript
import { isEmail, isURL, isCreditCard } from 'ts-validation'

isEmail('test@example.com') // true
isURL('https://example.com') // true
isCreditCard('4111111111111111') // true
```

## Validator Categories

ts-validation provides validators organized into logical categories:

### Email/URL/IP Validators

```typescript
import validator from 'ts-validation'

// Email validation
validator.isEmail('user@example.com') // true
validator.isEmail('user@example.com', { allow_display_name: true })

// URL validation
validator.isURL('https://example.com') // true
validator.isURL('https://example.com', {
  protocols: ['https'],
  require_protocol: true
})

// IP address validation
validator.isIP('192.168.1.1') // true (IPv4)
validator.isIP('2001:0db8:85a3::1', 6) // true (IPv6)
validator.isIPRange('192.168.1.0/24') // true

// Domain validation
validator.isFQDN('example.com') // true
validator.isMACAddress('01:23:45:67:89:ab') // true
```

### String Type Validators

```typescript
// Alphabetic
validator.isAlpha('Hello') // true
validator.isAlpha('Hello123') // false
validator.isAlpha('Bonjour', 'fr-FR') // true (with locale)

// Alphanumeric
validator.isAlphanumeric('Hello123') // true

// Numeric
validator.isNumeric('12345') // true
validator.isInt('42') // true
validator.isFloat('3.14') // true
validator.isDecimal('99.99') // true

// Case
validator.isLowercase('hello') // true
validator.isUppercase('HELLO') // true

// Format
validator.isAscii('Hello World') // true
validator.isMultibyte('Hello World') // false
validator.isEmpty('') // true
```

### Financial Validators

```typescript
// Credit cards
validator.isCreditCard('4111111111111111') // true

// Banking
validator.isIBAN('GB82WEST12345698765432') // true
validator.isBIC('DEUTDEFF') // true

// Currency
validator.isCurrency('$100.00') // true
validator.isCurrency('100,00 EUR', { symbol: 'EUR', decimal_separator: ',' })

// Cryptocurrency
validator.isEthereumAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F') // true
validator.isBtcAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2') // true
```

### Date and Time Validators

```typescript
// Date formats
validator.isDate('2024-01-15') // true
validator.isISO8601('2024-01-15T10:30:00Z') // true
validator.isRFC3339('2024-01-15T10:30:00Z') // true

// Time
validator.isTime('10:30') // true
validator.isTime('10:30:45', { hourFormat: 'hour24', mode: 'withSeconds' })

// Date comparison
validator.isAfter('2024-12-31', '2024-01-01') // true
validator.isBefore('2024-01-01', '2024-12-31') // true
```

### Identification Validators

```typescript
// UUID
validator.isUUID('550e8400-e29b-41d4-a716-446655440000') // true
validator.isUUID('550e8400-e29b-41d4-a716-446655440000', 4) // v4 specifically

// Other identifiers
validator.isMongoId('507f1f77bcf86cd799439011') // true
validator.isIMEI('490154203237518') // true
validator.isISBN('978-3-16-148410-0') // true
validator.isISBN('0-306-40615-2', 10) // ISBN-10

// JSON Web Token
validator.isJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...') // true
```

### Geographic Validators

```typescript
// Coordinates
validator.isLatLong('40.7128,-74.0060') // true

// Postal codes
validator.isPostalCode('10001', 'US') // true
validator.isPostalCode('SW1A 1AA', 'GB') // true

// Phone numbers
validator.isMobilePhone('+14155552671', 'en-US') // true
validator.isMobilePhone('+447911123456', 'en-GB') // true

// License plates
validator.isLicensePlate('ABC-123', 'en-US') // true
```

### Security Validators

```typescript
// Password strength
validator.isStrongPassword('MyP@ssw0rd!', {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
})

// Hash validation
validator.isMD5('d41d8cd98f00b204e9800998ecf8427e') // true
validator.isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'sha256')
```

### Encoding Validators

```typescript
// Base64
validator.isBase64('SGVsbG8gV29ybGQ=') // true
validator.isBase32('JBSWY3DPEBLW64TMMQ======') // true
validator.isBase58('2NEpo7TZRRrLZSi2U') // true

// Hexadecimal
validator.isHexadecimal('deadbeef') // true
validator.isHexColor('#ff0000') // true
validator.isRgbColor('rgb(255, 0, 0)') // true
validator.isHSL('hsl(360, 100%, 50%)') // true
```

## Sanitization Functions

ts-validation also provides functions to sanitize and normalize input:

```typescript
// Trimming
validator.trim('  hello  ') // 'hello'
validator.ltrim('  hello  ') // 'hello  '
validator.rtrim('  hello  ') // '  hello'

// Email normalization
validator.normalizeEmail('Test.User@EXAMPLE.COM')
// 'testuser@example.com'

// Escaping
validator.escape('<script>alert("xss")</script>')
// '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
validator.unescape('&lt;script&gt;')
// '<script>'

// Character filtering
validator.whitelist('hello123', 'a-z') // 'hello'
validator.blacklist('hello123', '0-9') // 'hello'
validator.stripLow('hello\x00world') // 'helloworld'
```

## Type Conversion

```typescript
// To date
validator.toDate('2024-01-15') // Date object

// To numbers
validator.toInt('42') // 42
validator.toInt('42.5') // 42
validator.toFloat('3.14') // 3.14

// To boolean
validator.toBoolean('true') // true
validator.toBoolean('1') // true
validator.toBoolean('false') // false
validator.toBoolean('0') // false
```

## Pattern Matching

```typescript
// Check if string contains substring
validator.contains('hello world', 'world') // true
validator.contains('hello world', 'WORLD', { ignoreCase: true }) // true

// Check if strings are equal
validator.equals('hello', 'hello') // true

// Regex matching
validator.matches('hello123', /^[a-z]+\d+$/) // true

// Check if in whitelist
validator.isWhitelisted('abc', 'abcdef') // true

// Check if in array
validator.isIn('apple', ['apple', 'banana', 'cherry']) // true
```

## Validator Options

Most validators accept optional configuration:

```typescript
// Email options
validator.isEmail('user@example.com', {
  allow_display_name: false,
  require_display_name: false,
  allow_utf8_local_part: true,
  require_tld: true,
  ignore_max_length: false,
  allow_ip_domain: false,
  domain_specific_validation: false,
  blacklisted_chars: '',
  host_blacklist: []
})

// URL options
validator.isURL('https://example.com', {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_port: false,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false,
  allow_fragments: true,
  allow_query_components: true,
  validate_length: true
})

// Strong password options
validator.isStrongPassword('password', {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
})
```

## Locale Support

Many validators support locale-specific validation:

```typescript
// Alphabetic with locale
validator.isAlpha('Café', 'fr-FR') // true

// Phone numbers with locale
validator.isMobilePhone('+14155552671', 'en-US') // true
validator.isMobilePhone('+447911123456', 'en-GB') // true

// Postal codes with locale
validator.isPostalCode('10001', 'US') // true
validator.isPostalCode('EC1A 1BB', 'GB') // true

// IBAN with locale
validator.isIBAN('DE89370400440532013000', 'DE') // true
```

## Next Steps

- [Validation Rules](/guide/rules) - Complete reference of all validation rules
- [Custom Validators](/guide/custom-validators) - Create your own validators
- [Error Messages](/guide/messages) - Customizing error messages
