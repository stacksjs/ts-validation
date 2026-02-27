# Custom Validators

While ts-validation provides 80+ built-in validators, you may need to create custom validators for domain-specific requirements. This guide shows how to create and use custom validators.

## Creating Simple Validators

A validator is simply a function that takes a string and returns a boolean:

```typescript
// Custom validator for product SKUs
function isProductSKU(value: string): boolean {
  // Format: 3 uppercase letters, dash, 6 digits
  return /^[A-Z]{3}-\d{6}$/.test(value)
}

// Usage
isProductSKU('ABC-123456') // true
isProductSKU('abc-123456') // false
isProductSKU('ABCD-12345') // false
```

## Validators with Options

For more flexible validators, accept an options object:

```typescript
interface OrderNumberOptions {
  prefix?: string
  minLength?: number
  maxLength?: number
}

function isOrderNumber(
  value: string,
  options: OrderNumberOptions = {}
): boolean {
  const {
    prefix = 'ORD',
    minLength = 8,
    maxLength = 12
  } = options

  // Must start with prefix
  if (!value.startsWith(prefix)) {
    return false
  }

  // Check remaining characters are digits
  const digits = value.slice(prefix.length)
  if (!/^\d+$/.test(digits)) {
    return false
  }

  // Check total length
  const length = value.length
  return length >= minLength && length <= maxLength
}

// Usage
isOrderNumber('ORD12345678') // true
isOrderNumber('INV12345678', { prefix: 'INV' }) // true
isOrderNumber('ORD123', { minLength: 5 }) // true
```

## Combining Built-in Validators

Create complex validators by combining existing ones:

```typescript
import validator from 'ts-validation'

interface BusinessEmailOptions {
  allowedDomains?: string[]
  requireCorporate?: boolean
}

function isBusinessEmail(
  value: string,
  options: BusinessEmailOptions = {}
): boolean {
  const { allowedDomains, requireCorporate = true } = options

  // First check if it's a valid email
  if (!validator.isEmail(value)) {
    return false
  }

  const domain = value.split('@')[1].toLowerCase()

  // Check against allowed domains if specified
  if (allowedDomains && allowedDomains.length > 0) {
    return allowedDomains.some(d => domain === d.toLowerCase())
  }

  // Reject common free email providers if requireCorporate
  if (requireCorporate) {
    const freeProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com',
      'outlook.com', 'aol.com', 'icloud.com'
    ]
    if (freeProviders.includes(domain)) {
      return false
    }
  }

  return true
}

// Usage
isBusinessEmail('john@company.com') // true
isBusinessEmail('john@gmail.com') // false (free provider)
isBusinessEmail('john@gmail.com', { requireCorporate: false }) // true
isBusinessEmail('john@acme.com', { allowedDomains: ['acme.com'] }) // true
```

## Async Validators

For validators that need external data:

```typescript
interface UniqueEmailOptions {
  checkDatabase?: boolean
  cacheResults?: boolean
}

async function isUniqueEmail(
  value: string,
  options: UniqueEmailOptions = {}
): Promise<boolean> {
  const { checkDatabase = true } = options

  // First validate email format
  if (!validator.isEmail(value)) {
    return false
  }

  if (!checkDatabase) {
    return true
  }

  // Check against database
  const exists = await db.users.exists({ email: value })
  return !exists
}

// Usage
const isUnique = await isUniqueEmail('new@example.com')
```

## Validator Factory Pattern

Create parameterized validators using factory functions:

```typescript
function createRangeValidator(min: number, max: number) {
  return function isInRange(value: string): boolean {
    const num = parseFloat(value)
    if (isNaN(num)) return false
    return num >= min && num <= max
  }
}

// Create specific validators
const isValidAge = createRangeValidator(0, 150)
const isValidPercentage = createRangeValidator(0, 100)
const isValidTemperature = createRangeValidator(-273.15, 1000)

// Usage
isValidAge('25') // true
isValidAge('200') // false
isValidPercentage('50') // true
isValidTemperature('-300') // false (below absolute zero)
```

## Validator with Detailed Results

Sometimes you need more than a boolean result:

```typescript
interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

function validatePassword(password: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  }

  // Check length
  if (password.length < 8) {
    result.errors.push('Password must be at least 8 characters')
    result.isValid = false
  } else if (password.length < 12) {
    result.warnings.push('Consider using 12+ characters for better security')
  }

  // Check for uppercase
  if (!/[A-Z]/.test(password)) {
    result.errors.push('Password must contain at least one uppercase letter')
    result.isValid = false
  }

  // Check for lowercase
  if (!/[a-z]/.test(password)) {
    result.errors.push('Password must contain at least one lowercase letter')
    result.isValid = false
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    result.errors.push('Password must contain at least one number')
    result.isValid = false
  }

  // Check for special characters
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.warnings.push('Adding special characters improves security')
  }

  // Check for common patterns
  const commonPatterns = ['password', '123456', 'qwerty', 'abc123']
  for (const pattern of commonPatterns) {
    if (password.toLowerCase().includes(pattern)) {
      result.errors.push('Password contains common patterns')
      result.isValid = false
      break
    }
  }

  return result
}

// Usage
const result = validatePassword('MyPass1')
// {
//   isValid: false,
//   errors: ['Password must be at least 8 characters'],
//   warnings: ['Adding special characters improves security']
// }
```

## Locale-Aware Validators

Create validators that respect locale settings:

```typescript
type Locale = 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR'

interface PhoneConfig {
  pattern: RegExp
  example: string
}

const phoneConfigs: Record<Locale, PhoneConfig> = {
  'en-US': {
    pattern: /^(\+1)?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    example: '+1 (555) 123-4567'
  },
  'en-GB': {
    pattern: /^(\+44)?[\s.-]?\d{4}[\s.-]?\d{6}$/,
    example: '+44 7911 123456'
  },
  'de-DE': {
    pattern: /^(\+49)?[\s.-]?\d{3,5}[\s.-]?\d{6,8}$/,
    example: '+49 30 123456'
  },
  'fr-FR': {
    pattern: /^(\+33)?[\s.-]?\d{1}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}$/,
    example: '+33 1 23 45 67 89'
  }
}

function isPhoneNumber(value: string, locale: Locale = 'en-US'): boolean {
  const config = phoneConfigs[locale]
  if (!config) {
    throw new Error(`Unsupported locale: ${locale}`)
  }
  return config.pattern.test(value)
}

// Usage
isPhoneNumber('+1 (555) 123-4567', 'en-US') // true
isPhoneNumber('+44 7911 123456', 'en-GB') // true
isPhoneNumber('+49 30 123456', 'de-DE') // true
```

## Composable Validator Builder

Build validators using a fluent API:

```typescript
class ValidatorBuilder {
  private validators: Array<(value: string) => boolean> = []
  private errorMessages: string[] = []

  required(message = 'Value is required'): this {
    this.validators.push(v => v.length > 0)
    this.errorMessages.push(message)
    return this
  }

  minLength(length: number, message?: string): this {
    this.validators.push(v => v.length >= length)
    this.errorMessages.push(message || `Must be at least ${length} characters`)
    return this
  }

  maxLength(length: number, message?: string): this {
    this.validators.push(v => v.length <= length)
    this.errorMessages.push(message || `Must be at most ${length} characters`)
    return this
  }

  pattern(regex: RegExp, message = 'Invalid format'): this {
    this.validators.push(v => regex.test(v))
    this.errorMessages.push(message)
    return this
  }

  email(message = 'Invalid email'): this {
    this.validators.push(v => validator.isEmail(v))
    this.errorMessages.push(message)
    return this
  }

  validate(value: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    for (let i = 0; i < this.validators.length; i++) {
      if (!this.validators[i](value)) {
        errors.push(this.errorMessages[i])
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  build(): (value: string) => boolean {
    return (value: string) => this.validate(value).isValid
  }
}

// Usage
const usernameValidator = new ValidatorBuilder()
  .required()
  .minLength(3, 'Username must be at least 3 characters')
  .maxLength(20, 'Username must be at most 20 characters')
  .pattern(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .build()

usernameValidator('john_doe') // true
usernameValidator('jo') // false
usernameValidator('john doe') // false (space not allowed)

// Get detailed validation
const validator = new ValidatorBuilder()
  .required()
  .email()
  .minLength(5)

const result = validator.validate('a@b')
// { isValid: false, errors: ['Must be at least 5 characters'] }
```

## Schema-Based Validation

Create a schema validator for objects:

```typescript
type ValidatorFn = (value: any) => boolean | string

interface Schema {
  [key: string]: ValidatorFn | ValidatorFn[]
}

interface ValidationErrors {
  [key: string]: string[]
}

function createSchemaValidator(schema: Schema) {
  return function validate(data: Record<string, any>): {
    isValid: boolean
    errors: ValidationErrors
  } {
    const errors: ValidationErrors = {}

    for (const [field, validators] of Object.entries(schema)) {
      const value = data[field]
      const validatorList = Array.isArray(validators) ? validators : [validators]
      const fieldErrors: string[] = []

      for (const validate of validatorList) {
        const result = validate(value)
        if (result !== true) {
          fieldErrors.push(typeof result === 'string' ? result : `${field} is invalid`)
        }
      }

      if (fieldErrors.length > 0) {
        errors[field] = fieldErrors
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
}

// Define a user schema
const userSchema: Schema = {
  email: [
    (v) => v?.length > 0 || 'Email is required',
    (v) => validator.isEmail(v) || 'Invalid email format'
  ],
  password: [
    (v) => v?.length >= 8 || 'Password must be at least 8 characters',
    (v) => /[A-Z]/.test(v) || 'Password must contain uppercase',
    (v) => /[0-9]/.test(v) || 'Password must contain a number'
  ],
  age: [
    (v) => v >= 18 || 'Must be at least 18 years old',
    (v) => v <= 120 || 'Invalid age'
  ]
}

const validateUser = createSchemaValidator(userSchema)

// Usage
const result = validateUser({
  email: 'invalid',
  password: 'weak',
  age: 15
})
// {
//   isValid: false,
//   errors: {
//     email: ['Invalid email format'],
//     password: ['Password must be at least 8 characters', 'Password must contain uppercase', 'Password must contain a number'],
//     age: ['Must be at least 18 years old']
//   }
// }
```

## Best Practices

### 1. Keep Validators Pure

Validators should not have side effects:

```typescript
// Good - pure function
function isValidCode(value: string): boolean {
  return /^[A-Z]{2}\d{4}$/.test(value)
}

// Bad - has side effects
function isValidCode(value: string): boolean {
  console.log('Validating:', value) // Side effect
  db.logValidation(value) // Side effect
  return /^[A-Z]{2}\d{4}$/.test(value)
}
```

### 2. Provide Clear Error Messages

When returning detailed results, be specific:

```typescript
// Good
{ error: 'Password must be at least 8 characters, got 5' }

// Bad
{ error: 'Invalid password' }
```

### 3. Handle Edge Cases

Consider null, undefined, and empty strings:

```typescript
function isValidUsername(value: string | null | undefined): boolean {
  if (!value) return false
  if (typeof value !== 'string') return false

  return /^[a-zA-Z0-9_]{3,20}$/.test(value)
}
```

### 4. Document Your Validators

```typescript
/**
 * Validates a company registration number.
 *
 * @param value - The registration number to validate
 * @param countryCode - ISO 3166-1 alpha-2 country code
 * @returns true if valid, false otherwise
 *
 * @example
 * isCompanyRegistration('12345678', 'GB') // true
 * isCompanyRegistration('SC123456', 'GB') // true (Scottish company)
 */
function isCompanyRegistration(value: string, countryCode: string): boolean {
  // Implementation
}
```

### 5. Make Validators Composable

Design validators to work well together:

```typescript
const validators = {
  isRequired: (v: string) => v.length > 0,
  isEmail: (v: string) => validator.isEmail(v),
  isMinLength: (min: number) => (v: string) => v.length >= min,
  isMaxLength: (max: number) => (v: string) => v.length <= max
}

// Compose validators
const isValidEmail = (v: string) =>
  validators.isRequired(v) &&
  validators.isEmail(v) &&
  validators.isMaxLength(255)(v)
```
