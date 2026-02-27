# Validation Rules

ts-validation provides 80+ validators organized into logical categories. This reference documents all available validation rules.

## Email, URL & Network

### isEmail()

Validates email addresses.

```typescript
import { isEmail } from 'ts-validation'

isEmail('user@example.com') // true
isEmail('invalid-email') // false

// With options
isEmail('User Name <user@example.com>', {
  allow_display_name: true
}) // true

isEmail('user@localhost', {
  require_tld: false
}) // true
```

**Options:**
- `allow_display_name` - Allow display name (default: false)
- `require_display_name` - Require display name (default: false)
- `allow_utf8_local_part` - Allow UTF-8 in local part (default: true)
- `require_tld` - Require top-level domain (default: true)
- `ignore_max_length` - Skip length validation (default: false)
- `allow_ip_domain` - Allow IP as domain (default: false)
- `domain_specific_validation` - Provider-specific validation (default: false)
- `blacklisted_chars` - Characters to reject (default: '')
- `host_blacklist` - Domains to reject (default: [])

### isURL()

Validates URLs.

```typescript
import { isURL } from 'ts-validation'

isURL('https://example.com') // true
isURL('ftp://files.example.com/path') // true
isURL('not a url') // false

// With options
isURL('https://example.com', {
  protocols: ['https'],
  require_protocol: true
})
```

**Options:**
- `protocols` - Allowed protocols (default: ['http', 'https', 'ftp'])
- `require_tld` - Require TLD (default: true)
- `require_protocol` - Require protocol (default: false)
- `require_host` - Require host (default: true)
- `require_port` - Require port (default: false)
- `allow_underscores` - Allow underscores in host (default: false)
- `allow_trailing_dot` - Allow trailing dot in host (default: false)
- `allow_protocol_relative_urls` - Allow // URLs (default: false)
- `allow_fragments` - Allow # fragments (default: true)
- `allow_query_components` - Allow ? query strings (default: true)
- `validate_length` - Validate URL length (default: true)

### isIP()

Validates IP addresses.

```typescript
import { isIP } from 'ts-validation'

isIP('192.168.1.1') // true (any version)
isIP('192.168.1.1', 4) // true (IPv4 only)
isIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334', 6) // true (IPv6)
isIP('invalid') // false
```

### isIPRange()

Validates IP ranges in CIDR notation.

```typescript
import { isIPRange } from 'ts-validation'

isIPRange('192.168.1.0/24') // true
isIPRange('2001:db8::/32') // true
isIPRange('192.168.1.0/33') // false (invalid range)
```

### isFQDN()

Validates fully qualified domain names.

```typescript
import { isFQDN } from 'ts-validation'

isFQDN('example.com') // true
isFQDN('sub.example.com') // true
isFQDN('localhost') // false (no TLD)

isFQDN('localhost', { require_tld: false }) // true
```

### isMACAddress()

Validates MAC addresses.

```typescript
import { isMACAddress } from 'ts-validation'

isMACAddress('01:23:45:67:89:ab') // true
isMACAddress('01-23-45-67-89-AB') // true
isMACAddress('0123.4567.89AB') // true

isMACAddress('01:23:45:67:89:AB', { no_separators: true }) // false
```

### isPort()

Validates port numbers.

```typescript
import { isPort } from 'ts-validation'

isPort('80') // true
isPort('65535') // true
isPort('65536') // false (out of range)
isPort('-1') // false
```

### isMailtoURI()

Validates mailto: URIs.

```typescript
import { isMailtoURI } from 'ts-validation'

isMailtoURI('mailto:user@example.com') // true
isMailtoURI('mailto:user@example.com?subject=Hello') // true
```

### isMagnetURI()

Validates magnet URIs.

```typescript
import { isMagnetURI } from 'ts-validation'

isMagnetURI('magnet:?xt=urn:btih:c12fe1c06bba254a9dc9f519b335aa7c1367a88a') // true
```

### isDataURI()

Validates data URIs.

```typescript
import { isDataURI } from 'ts-validation'

isDataURI('data:text/plain;base64,SGVsbG8=') // true
isDataURI('data:image/png;base64,iVBORw0KGgo...') // true
```

## String Types

### isAlpha()

Validates alphabetic strings.

```typescript
import { isAlpha } from 'ts-validation'

isAlpha('Hello') // true
isAlpha('Hello123') // false

// With locale
isAlpha('Café', 'fr-FR') // true
isAlpha('Привет', 'ru-RU') // true
```

**Supported Locales:** ar, ar-AE, ar-BH, ar-DZ, ar-EG, ar-IQ, ar-JO, ar-KW, ar-LB, ar-LY, ar-MA, ar-QA, ar-QM, ar-SA, ar-SD, ar-SY, ar-TN, ar-YE, bg-BG, bn, cs-CZ, da-DK, de-DE, el-GR, en-AU, en-GB, en-HK, en-IN, en-NZ, en-US, en-ZA, en-ZM, es-ES, fa-IR, fi-FI, fr-CA, fr-FR, he, hi-IN, hu-HU, it-IT, ja-JP, ko-KR, ku-IQ, nb-NO, nl-NL, nn-NO, pl-PL, pt-BR, pt-PT, ru-RU, si-LK, sk-SK, sl-SI, sr-RS, sr-RS@latin, sv-SE, th-TH, tr-TR, uk-UA, vi-VN, zh-CN, zh-TW

### isAlphanumeric()

Validates alphanumeric strings.

```typescript
import { isAlphanumeric } from 'ts-validation'

isAlphanumeric('Hello123') // true
isAlphanumeric('Hello 123') // false (contains space)

// With locale
isAlphanumeric('Café123', 'fr-FR') // true
```

### isNumeric()

Validates numeric strings.

```typescript
import { isNumeric } from 'ts-validation'

isNumeric('123') // true
isNumeric('-123') // true
isNumeric('123.45') // true
isNumeric('123e5') // true

isNumeric('123', { no_symbols: true }) // true
isNumeric('-123', { no_symbols: true }) // false
```

### isInt()

Validates integer strings.

```typescript
import { isInt } from 'ts-validation'

isInt('123') // true
isInt('-123') // true
isInt('123.45') // false

// With options
isInt('5', { min: 1, max: 10 }) // true
isInt('5', { gt: 0, lt: 10 }) // true
isInt('5', { allow_leading_zeroes: false }) // true
```

### isFloat()

Validates floating-point number strings.

```typescript
import { isFloat } from 'ts-validation'

isFloat('3.14') // true
isFloat('-3.14') // true
isFloat('3') // true

// With options
isFloat('3.14', { min: 0, max: 10 }) // true
isFloat('3,14', { locale: 'de-DE' }) // true (German decimal)
```

### isDecimal()

Validates decimal number strings.

```typescript
import { isDecimal } from 'ts-validation'

isDecimal('123.45') // true
isDecimal('-123.45') // true

// With options
isDecimal('123.45', {
  decimal_digits: '2',  // Exactly 2 decimal places
  force_decimal: true
})
```

### isHexadecimal()

Validates hexadecimal strings.

```typescript
import { isHexadecimal } from 'ts-validation'

isHexadecimal('deadBEEF') // true
isHexadecimal('0x123') // false (no prefix allowed)
```

### isOctal()

Validates octal strings.

```typescript
import { isOctal } from 'ts-validation'

isOctal('0o777') // true
isOctal('777') // true
```

### isLowercase()

Validates lowercase strings.

```typescript
import { isLowercase } from 'ts-validation'

isLowercase('hello') // true
isLowercase('Hello') // false
```

### isUppercase()

Validates uppercase strings.

```typescript
import { isUppercase } from 'ts-validation'

isUppercase('HELLO') // true
isUppercase('Hello') // false
```

### isAscii()

Validates ASCII strings.

```typescript
import { isAscii } from 'ts-validation'

isAscii('Hello World!') // true
isAscii('Hello Wörld') // false (contains ö)
```

### isMultibyte()

Validates strings with multibyte characters.

```typescript
import { isMultibyte } from 'ts-validation'

isMultibyte('Hello') // false
isMultibyte('Hello World') // false
isMultibyte('') // true (Japanese)
```

### isBoolean()

Validates boolean strings.

```typescript
import { isBoolean } from 'ts-validation'

isBoolean('true') // true
isBoolean('false') // true
isBoolean('1') // true
isBoolean('0') // true
isBoolean('yes') // false

isBoolean('yes', { loose: true }) // true
```

### isEmpty()

Checks if string is empty.

```typescript
import { isEmpty } from 'ts-validation'

isEmpty('') // true
isEmpty('   ') // false

isEmpty('   ', { ignore_whitespace: true }) // true
```

### isLength()

Validates string length.

```typescript
import { isLength } from 'ts-validation'

isLength('hello', { min: 1, max: 10 }) // true
isLength('hello', { min: 10 }) // false
```

### isByteLength()

Validates string byte length.

```typescript
import { isByteLength } from 'ts-validation'

isByteLength('hello', { min: 1, max: 10 }) // true
isByteLength('', { min: 5 }) // true (5 bytes in UTF-8)
```

### isSlug()

Validates URL slugs.

```typescript
import { isSlug } from 'ts-validation'

isSlug('hello-world') // true
isSlug('hello_world') // true
isSlug('Hello World') // false
```

### isSemVer()

Validates semantic version strings.

```typescript
import { isSemVer } from 'ts-validation'

isSemVer('1.0.0') // true
isSemVer('1.0.0-alpha.1') // true
isSemVer('1.0.0+build.123') // true
isSemVer('1.0') // false
```

## Financial

### isCreditCard()

Validates credit card numbers.

```typescript
import { isCreditCard } from 'ts-validation'

isCreditCard('4111111111111111') // true (Visa)
isCreditCard('5500000000000004') // true (Mastercard)
isCreditCard('340000000000009') // true (Amex)

// With provider
isCreditCard('4111111111111111', { provider: 'visa' }) // true
```

### isIBAN()

Validates International Bank Account Numbers.

```typescript
import { isIBAN } from 'ts-validation'

isIBAN('GB82WEST12345698765432') // true
isIBAN('DE89370400440532013000') // true

// With country whitelist
isIBAN('GB82WEST12345698765432', {
  whitelist: ['GB', 'DE']
})
```

### isBIC()

Validates Bank Identifier Codes (SWIFT codes).

```typescript
import { isBIC } from 'ts-validation'

isBIC('DEUTDEFF') // true
isBIC('DEUTDEFF500') // true
```

### isCurrency()

Validates currency amount strings.

```typescript
import { isCurrency } from 'ts-validation'

isCurrency('$100.00') // true
isCurrency('100,00 EUR', {
  symbol: 'EUR',
  decimal_separator: ','
}) // true

// Options
isCurrency('$100', {
  symbol: '$',
  require_symbol: true,
  allow_space_after_symbol: false,
  symbol_after_digits: false,
  allow_negatives: true,
  parens_for_negatives: false,
  negative_sign_before_digits: true,
  negative_sign_after_digits: false,
  allow_negative_sign_placeholder: false,
  thousands_separator: ',',
  decimal_separator: '.',
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [2]
})
```

### isEthereumAddress()

Validates Ethereum addresses.

```typescript
import { isEthereumAddress } from 'ts-validation'

isEthereumAddress('0x71C7656EC7ab88b098defB751B7401B5f6d8976F') // true
```

### isBtcAddress()

Validates Bitcoin addresses.

```typescript
import { isBtcAddress } from 'ts-validation'

isBtcAddress('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2') // true (P2PKH)
isBtcAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy') // true (P2SH)
isBtcAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq') // true (Bech32)
```

### isLuhnNumber()

Validates numbers using Luhn algorithm.

```typescript
import { isLuhnNumber } from 'ts-validation'

isLuhnNumber('79927398713') // true
```

### isDivisibleBy()

Checks if number is divisible by another.

```typescript
import { isDivisibleBy } from 'ts-validation'

isDivisibleBy('100', '10') // true
isDivisibleBy('101', '10') // false
```

## Date & Time

### isDate()

Validates date strings.

```typescript
import { isDate } from 'ts-validation'

isDate('2024-01-15') // true
isDate('01/15/2024') // true

// With options
isDate('2024-01-15', {
  format: 'YYYY-MM-DD',
  strictMode: true,
  delimiters: ['-']
})
```

### isTime()

Validates time strings.

```typescript
import { isTime } from 'ts-validation'

isTime('10:30') // true
isTime('10:30:45') // true

// With options
isTime('10:30 PM', {
  hourFormat: 'hour12',
  mode: 'default'
})
```

### isISO8601()

Validates ISO 8601 date strings.

```typescript
import { isISO8601 } from 'ts-validation'

isISO8601('2024-01-15') // true
isISO8601('2024-01-15T10:30:00Z') // true
isISO8601('2024-01-15T10:30:00+05:30') // true

// With options
isISO8601('2024-01-15', {
  strict: true,
  strictSeparator: true
})
```

### isRFC3339()

Validates RFC 3339 date strings.

```typescript
import { isRFC3339 } from 'ts-validation'

isRFC3339('2024-01-15T10:30:00Z') // true
isRFC3339('2024-01-15T10:30:00.123Z') // true
```

### isAfter()

Checks if date is after another date.

```typescript
import { isAfter } from 'ts-validation'

isAfter('2024-12-31', '2024-01-01') // true
isAfter('2024-01-01') // true if after now
```

### isBefore()

Checks if date is before another date.

```typescript
import { isBefore } from 'ts-validation'

isBefore('2024-01-01', '2024-12-31') // true
isBefore('2024-01-01') // true if before now
```

## Identifiers

### isUUID()

Validates UUIDs.

```typescript
import { isUUID } from 'ts-validation'

isUUID('550e8400-e29b-41d4-a716-446655440000') // true (any version)
isUUID('550e8400-e29b-41d4-a716-446655440000', 4) // true (v4 only)
isUUID('f47ac10b-58cc-1198-a2e9-000c29ef7b33', 1) // true (v1 only)
```

### isULID()

Validates ULIDs.

```typescript
import { isULID } from 'ts-validation'

isULID('01ARZ3NDEKTSV4RRFFQ69G5FAV') // true
```

### isMongoId()

Validates MongoDB ObjectIds.

```typescript
import { isMongoId } from 'ts-validation'

isMongoId('507f1f77bcf86cd799439011') // true
```

### isJWT()

Validates JSON Web Tokens.

```typescript
import { isJWT } from 'ts-validation'

isJWT('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U') // true
```

### isJSON()

Validates JSON strings.

```typescript
import { isJSON } from 'ts-validation'

isJSON('{"name": "John"}') // true
isJSON('[1, 2, 3]') // true
isJSON('invalid') // false

// With options
isJSON('null', { allow_primitives: true }) // true
```

### isMD5()

Validates MD5 hashes.

```typescript
import { isMD5 } from 'ts-validation'

isMD5('d41d8cd98f00b204e9800998ecf8427e') // true
```

### isHash()

Validates various hash formats.

```typescript
import { isHash } from 'ts-validation'

isHash('d41d8cd98f00b204e9800998ecf8427e', 'md5') // true
isHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'sha256') // true
isHash('38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b', 'sha384') // true
```

**Supported Algorithms:** md4, md5, sha1, sha256, sha384, sha512, ripemd128, ripemd160, tiger128, tiger160, tiger192, crc32, crc32b

### isISBN()

Validates International Standard Book Numbers.

```typescript
import { isISBN } from 'ts-validation'

isISBN('978-3-16-148410-0') // true (ISBN-13)
isISBN('0-306-40615-2', 10) // true (ISBN-10)
```

### isISIN()

Validates International Securities Identification Numbers.

```typescript
import { isISIN } from 'ts-validation'

isISIN('US0378331005') // true
```

### isISSN()

Validates International Standard Serial Numbers.

```typescript
import { isISSN } from 'ts-validation'

isISSN('0317-8471') // true

// With options
isISSN('0317-8471', {
  case_sensitive: true,
  require_hyphen: true
})
```

### isISRC()

Validates International Standard Recording Codes.

```typescript
import { isISRC } from 'ts-validation'

isISRC('USRC17607839') // true
```

### isEAN()

Validates European Article Numbers.

```typescript
import { isEAN } from 'ts-validation'

isEAN('4006381333931') // true (EAN-13)
isEAN('96385074') // true (EAN-8)
```

### isIMEI()

Validates International Mobile Equipment Identity numbers.

```typescript
import { isIMEI } from 'ts-validation'

isIMEI('490154203237518') // true

// With options
isIMEI('49-015420-323751-8', {
  allow_hyphens: true
})
```

## Geographic

### isLatLong()

Validates latitude/longitude coordinates.

```typescript
import { isLatLong } from 'ts-validation'

isLatLong('40.7128,-74.0060') // true
isLatLong('40.7128, -74.0060') // true

// With options
isLatLong('-23.5505,-46.6333', {
  checkDMS: false  // Don't check DMS format
})
```

### isPostalCode()

Validates postal/ZIP codes.

```typescript
import { isPostalCode } from 'ts-validation'

isPostalCode('10001', 'US') // true
isPostalCode('SW1A 1AA', 'GB') // true
isPostalCode('100-0001', 'JP') // true
isPostalCode('75001', 'FR') // true

isPostalCode('10001', 'any') // true (any country)
```

**Supported Locales:** AD, AT, AU, AZ, BA, BE, BG, BR, BY, CA, CH, CN, CZ, DE, DK, DO, DZ, EE, ES, FI, FR, GB, GR, HR, HU, ID, IE, IL, IN, IR, IS, IT, JP, KE, KR, LI, LK, LT, LU, LV, MC, MD, ME, MK, MT, MX, MY, NL, NO, NP, NZ, PL, PR, PT, RO, RS, RU, SA, SE, SG, SI, SK, SM, TH, TN, TR, TW, UA, US, VA, ZA, ZM

### isMobilePhone()

Validates mobile phone numbers.

```typescript
import { isMobilePhone } from 'ts-validation'

isMobilePhone('+14155552671', 'en-US') // true
isMobilePhone('+447911123456', 'en-GB') // true
isMobilePhone('+81901234567', 'ja-JP') // true

// Check any locale
isMobilePhone('+14155552671', 'any') // true

// With options
isMobilePhone('+1 415 555 2671', 'en-US', {
  strictMode: false  // Allow formatting
})
```

### isLicensePlate()

Validates vehicle license plates.

```typescript
import { isLicensePlate } from 'ts-validation'

isLicensePlate('ABC-123', 'en-US') // true
isLicensePlate('AB12 CDE', 'en-GB') // true
```

## ISO Standards

### isISO6391()

Validates ISO 639-1 language codes.

```typescript
import { isISO6391 } from 'ts-validation'

isISO6391('en') // true
isISO6391('fr') // true
isISO6391('xx') // false
```

### isISO15924()

Validates ISO 15924 script codes.

```typescript
import { isISO15924 } from 'ts-validation'

isISO15924('Latn') // true (Latin)
isISO15924('Cyrl') // true (Cyrillic)
```

### isISO31661Alpha2()

Validates ISO 3166-1 alpha-2 country codes.

```typescript
import { isISO31661Alpha2 } from 'ts-validation'

isISO31661Alpha2('US') // true
isISO31661Alpha2('GB') // true
isISO31661Alpha2('XX') // false
```

### isISO31661Alpha3()

Validates ISO 3166-1 alpha-3 country codes.

```typescript
import { isISO31661Alpha3 } from 'ts-validation'

isISO31661Alpha3('USA') // true
isISO31661Alpha3('GBR') // true
```

### isISO31661Numeric()

Validates ISO 3166-1 numeric country codes.

```typescript
import { isISO31661Numeric } from 'ts-validation'

isISO31661Numeric('840') // true (US)
isISO31661Numeric('826') // true (GB)
```

### isISO4217()

Validates ISO 4217 currency codes.

```typescript
import { isISO4217 } from 'ts-validation'

isISO4217('USD') // true
isISO4217('EUR') // true
isISO4217('XXX') // false
```

### isISO6346()

Validates ISO 6346 container codes.

```typescript
import { isISO6346, isFreightContainerID } from 'ts-validation'

isISO6346('CSQU3054383') // true
isFreightContainerID('CSQU3054383') // true (alias)
```

## Colors

### isHexColor()

Validates hexadecimal color codes.

```typescript
import { isHexColor } from 'ts-validation'

isHexColor('#ff0000') // true
isHexColor('#f00') // true (shorthand)
isHexColor('ff0000') // true (without #)
```

### isRgbColor()

Validates RGB color values.

```typescript
import { isRgbColor } from 'ts-validation'

isRgbColor('rgb(255, 0, 0)') // true
isRgbColor('rgba(255, 0, 0, 0.5)') // true

// With options
isRgbColor('rgb(255, 0, 0)', {
  includePercentValues: false
})
```

### isHSL()

Validates HSL color values.

```typescript
import { isHSL } from 'ts-validation'

isHSL('hsl(360, 100%, 50%)') // true
isHSL('hsla(360, 100%, 50%, 0.5)') // true
```

## Security

### isStrongPassword()

Validates password strength.

```typescript
import { isStrongPassword } from 'ts-validation'

isStrongPassword('MyP@ssw0rd!') // true

// With options
isStrongPassword('MyP@ssw0rd!', {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1
})

// Get score instead of boolean
isStrongPassword('MyPassword', {
  returnScore: true,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10
}) // Returns number
```

## Encoding

### isBase64()

Validates Base64 encoded strings.

```typescript
import { isBase64 } from 'ts-validation'

isBase64('SGVsbG8gV29ybGQ=') // true

// With options
isBase64('SGVsbG8gV29ybGQ', {
  urlSafe: false
})
```

### isBase32()

Validates Base32 encoded strings.

```typescript
import { isBase32 } from 'ts-validation'

isBase32('JBSWY3DPEBLW64TMMQ======') // true

// With options
isBase32('JBSWY3DPEBLW64TMMQ', {
  crockford: false
})
```

### isBase58()

Validates Base58 encoded strings.

```typescript
import { isBase58 } from 'ts-validation'

isBase58('2NEpo7TZRRrLZSi2U') // true
```

## Identification Documents

### isPassportNumber()

Validates passport numbers.

```typescript
import { isPassportNumber } from 'ts-validation'

isPassportNumber('123456789', 'US') // true
isPassportNumber('AB1234567', 'GB') // true
```

### isIdentityCard()

Validates national identity card numbers.

```typescript
import { isIdentityCard } from 'ts-validation'

isIdentityCard('12345678Z', 'ES') // true (Spanish DNI)
```

### isTaxID()

Validates tax identification numbers.

```typescript
import { isTaxID } from 'ts-validation'

isTaxID('123-45-6789', 'en-US') // true (SSN format)
```

### isVAT()

Validates VAT numbers.

```typescript
import { isVAT } from 'ts-validation'

isVAT('DE123456789', 'DE') // true
isVAT('GB123456789', 'GB') // true
```

## Utility Functions

### contains()

Checks if string contains substring.

```typescript
import { contains } from 'ts-validation'

contains('hello world', 'world') // true
contains('hello world', 'WORLD', { ignoreCase: true }) // true
contains('hello world', 'world', { minOccurrences: 2 }) // false
```

### equals()

Checks if strings are equal.

```typescript
import { equals } from 'ts-validation'

equals('hello', 'hello') // true
equals('Hello', 'hello') // false
```

### matches()

Tests string against regex pattern.

```typescript
import { matches } from 'ts-validation'

matches('hello123', /^[a-z]+\d+$/) // true
matches('hello123', '^[a-z]+\\d+$') // true (string pattern)
matches('hello123', '^[A-Z]+\\d+$', 'i') // true (with flags)
```

### isIn()

Checks if string is in array.

```typescript
import { isIn } from 'ts-validation'

isIn('apple', ['apple', 'banana', 'cherry']) // true
isIn('orange', ['apple', 'banana', 'cherry']) // false
```

### isWhitelisted()

Checks if string contains only whitelisted characters.

```typescript
import { isWhitelisted } from 'ts-validation'

isWhitelisted('abc', 'abcdef') // true
isWhitelisted('abcg', 'abcdef') // false
```
