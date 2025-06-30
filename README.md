<p align="center"><img src=".github/art/cover.jpg" alt="Social Card of this repo"></p>

[![npm version][npm-version-src]][npm-version-href]
[![GitHub Actions][github-actions-src]][github-actions-href]
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
<!-- [![npm downloads][npm-downloads-src]][npm-downloads-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

# @stacksjs/ts-validation

A lightweight, type-safe validation library for TypeScript with blazing-fast performance, built for Bun.

## Features

- 🚀 **Blazing fast performance** - Optimized for speed
- 🔒 **Type-safe** - Full TypeScript support with strong typing
- 🔄 **Fluent API** - Chain validation rules for clean, readable code
- 🏗️ **Composable** - Create reusable validations and schemas
- 🧩 **Extendable** - Easy to add custom validators
- 💾 **Tiny footprint** - Lightweight with no dependencies
- 🔍 **Detailed errors** - Comprehensive error reporting
- 🛡️ **Robust validation** - Handles null, undefined, and edge cases properly

## Installation

```bash
# Using bun
bun add @stacksjs/ts-validation

# Using npm
npm install @stacksjs/ts-validation

# Using yarn
yarn add @stacksjs/ts-validation

# Using pnpm
pnpm add @stacksjs/ts-validation
```

## Quick Start

```typescript
import { v } from '@stacksjs/ts-validation'

// Create a validator for a user object
const userValidator = v.object({
  name: v.string().min(2).max(50).required(),
  email: v.string().email().required(),
  age: v.integer().min(18).max(120).required(),
  website: v.string().url().optional(),
  tags: v.array().each(v.string()).optional(),
})

// Validate a user object
const user = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  website: 'https://example.com',
  tags: ['developer', 'TypeScript'],
}

const result = userValidator.validate(user)

if (result.valid) {
  console.log('User is valid!')
}
else {
  console.error('Validation errors:', result.errors)
}
```

## Basic Usage

### Simple Validation

```typescript
import { v } from '@stacksjs/ts-validation'

// Validate a single value
const emailValidator = v.string().email().required()
const result = emailValidator.validate('john@example.com')

if (result.valid) {
  console.log('Email is valid!')
}
else {
  console.log('Validation errors:', result.errors)
}

// Quick test method
const isValid = emailValidator.test('john@example.com') // returns boolean
```

### Error Handling

```typescript
const result = userValidator.validate(invalidUser)

if (!result.valid) {
  // For single field validation
  result.errors.forEach((error) => {
    console.log(error.message)
  })

  // For object validation
  Object.entries(result.errors).forEach(([field, errors]) => {
    console.log(`${field}:`, errors.map(e => e.message))
  })
}
```

## Validation Types

### String Validation

```typescript
// Basic string validation
const nameValidator = v.string().min(2).max(50).required()

// Email validation
const emailValidator = v.string().email().required()

// URL validation
const websiteValidator = v.string().url().optional()

// Pattern matching
const zipCodeValidator = v.string().matches(/^\d{5}$/).required()

// Alphanumeric, alpha, or numeric characters
const usernameValidator = v.string().alphanumeric().required()

// Text validation (specialized for text content)
const bioValidator = v.text().max(500).optional()
```

### Number Validation

```typescript
// Basic number validation
const ageValidator = v.number().min(18).max(120).required()

// Integer validation (whole numbers only)
const quantityValidator = v.integer().positive().required()

// Float validation (decimal numbers)
const priceValidator = v.float().min(0.01).required()

// Small integer validation (-32,768 to 32,767)
const smallNumberValidator = v.smallint().required()

// Decimal validation (with precision control)
const decimalValidator = v.decimal().min(0).max(999.99).required()

// Negative numbers
const temperatureValidator = v.number().negative().required()
```

### Boolean Validation

```typescript
// Boolean validation
const termsAcceptedValidator = v.boolean().required()
```

### Array Validation

```typescript
// Array validation
const tagsValidator = v.array().min(1).max(10).required()

// Validate each item in the array
const numbersValidator = v.array().each(v.number().positive()).required()

// Array with specific length
const coordinatesValidator = v.array().length(2).each(v.number()).required()
```

### Object Validation

```typescript
// Object validation
const addressValidator = v.object({
  street: v.string().required(),
  city: v.string().required(),
  state: v.string().length(2).required(),
  zip: v.string().matches(/^\d{5}$/).required(),
})

// Nested object validation
const userValidator = v.object({
  name: v.string().required(),
  address: addressValidator,
})

// Strict object validation (no extra fields allowed)
const strictValidator = v.object().strict().shape({
  id: v.number().required(),
  name: v.string().required(),
})
```

### Date and Time Validation

```typescript
// Basic date validation
const dateValidator = v.date()
expect(dateValidator.test(new Date())).toBe(true)
expect(dateValidator.test(new Date('invalid'))).toBe(false)

// Datetime validation (MySQL DATETIME compatible)
const datetimeValidator = v.datetime()
expect(datetimeValidator.test(new Date('2023-01-01'))).toBe(true)

// Time validation (24-hour format)
const timeValidator = v.time()
expect(timeValidator.test('14:30')).toBe(true)
expect(timeValidator.test('25:00')).toBe(false) // Invalid hour

// Unix timestamp validation
const unixValidator = v.unix()
expect(unixValidator.test(1683912345)).toBe(true) // Seconds
expect(unixValidator.test(1683912345000)).toBe(true) // Milliseconds

// Regular timestamp validation (MySQL TIMESTAMP compatible)
const timestampValidator = v.timestamp()
expect(timestampValidator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC

// Timestamp with timezone
const timestampTzValidator = v.timestampTz()
```

### JSON Validation

```typescript
// JSON string validation
const jsonValidator = v.json()
expect(jsonValidator.test('{"name": "John"}')).toBe(true)
expect(jsonValidator.test('{"a": 1, "b": 2}')).toBe(true)
expect(jsonValidator.test('123')).toBe(false) // Primitive values are invalid
expect(jsonValidator.test('not json')).toBe(false)
```

### Binary and Blob Validation

```typescript
// Binary data validation
const binaryValidator = v.binary()

// Blob validation
const blobValidator = v.blob()
```

### BigInt Validation

```typescript
// BigInt validation
const bigIntValidator = v.bigint().min(0n).max(1000000n).required()
```

### Enum Validation

```typescript
// Enum validation
const statusValidator = v.enum(['active', 'inactive', 'pending']).required()
```

### Custom Validation

```typescript
// Custom validation
const isEven = (val: number) => val % 2 === 0
const evenNumberValidator = v.custom(isEven, 'Number must be even')

// Complex custom validation
const passwordValidator = v.string()
  .min(8)
  .matches(/[A-Z]/)
  .matches(/[a-z]/)
  .matches(/\d/)
  .matches(/[^A-Z0-9]/i)
```

### Password Validation

The password validator provides comprehensive password validation with multiple security rules:

```typescript
// Basic password validation
const passwordValidator = v.password()
  .min(8)
  .max(128)
  .alphanumeric()
  .hasUppercase()
  .hasLowercase()
  .hasNumbers()
  .hasSpecialCharacters()

// Validate a password
const result = passwordValidator.validate('MySecureP@ss123')

if (result.valid) {
  console.log('Password is valid!')
}
else {
  console.error('Validation errors:', result.errors)
}

// Password matching validation
const confirmPasswordValidator = v.password().matches('MySecureP@ss123')
```

## Advanced Usage

### Conditional Validation

```typescript
const userValidator = v.object({
  name: v.string().required(),
  email: v.string().email().required(),
  age: v.integer().min(18).required(),
  // Conditional validation based on age
  guardianInfo: v.object({
    name: v.string().required(),
    phone: v.string().required(),
  }).custom((value, data) => {
    return data.age < 18 ? value !== null : true
  }, 'Guardian information required for users under 18'),
})
```

### Reusable Validators

```typescript
// Create reusable validators
const emailValidator = v.string().email().required()
const phoneValidator = v.string().matches(/^\+?[\d\s-()]+$/).required()

// Use them in multiple places
const contactFormValidator = v.object({
  email: emailValidator,
  phone: phoneValidator,
})

const userProfileValidator = v.object({
  primaryEmail: emailValidator,
  secondaryEmail: emailValidator.optional(),
  phone: phoneValidator.optional(),
})
```

### Validation with Custom Error Messages

```typescript
const userValidator = v.object({
  name: v.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .required('Name is required'),
  email: v.string()
    .email('Please provide a valid email address')
    .required('Email is required'),
})
```

## Error Handling Examples

```typescript
// Single field validation
const emailResult = emailValidator.validate('invalid-email')
if (!emailResult.valid) {
  emailResult.errors.forEach((error) => {
    console.log(`Email error: ${error.message}`)
  })
}

// Object validation
const userResult = userValidator.validate(invalidUser)
if (!userResult.valid) {
  // userResult.errors is an object with field names as keys
  Object.entries(userResult.errors).forEach(([field, errors]) => {
    console.log(`${field}:`)
    errors.forEach((error) => {
      console.log(`  - ${error.message}`)
    })
  })
}
```

## Performance Tips

1. **Reuse validators**: Create validators once and reuse them instead of creating new ones for each validation
2. **Use specific validators**: Use `v.integer()` instead of `v.number().integer()` for better performance
3. **Chain efficiently**: Order validation rules from most likely to fail first
4. **Avoid unnecessary validations**: Use `.optional()` for fields that can be undefined

## TypeScript Integration

```typescript
import { v } from '@stacksjs/ts-validation'

// Type-safe validation
interface User {
  name: string
  email: string
  age: number
}

const userValidator = v.object({
  name: v.string().required(),
  email: v.string().email().required(),
  age: v.integer().min(18).required(),
})

// The result is fully typed
const result = userValidator.validate(userData)
if (result.valid) {
  // TypeScript knows userData is valid here
  const validUser: User = userData
}
```

## Configuration

You can customize the validation behavior by modifying the `validation.config.ts` file:

```typescript
// validation.config.ts
import type { ValidationOptions } from '@stacksjs/ts-validation'

const config: ValidationOptions = {
  verbose: true, // Enable detailed error messages
  strictMode: false, // Stop on first error if true
  cacheResults: true, // Cache validation results for better performance
  errorMessages: {
    // Customize error messages
    required: '{field} is required',
    email: '{field} must be a valid email address',
    // ...more custom messages
  },
}

export default config
```

## Testing

```bash
bun test
```

## Changelog

Please see our [releases](https://github.com/stackjs/ts-validation/releases) page for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Discussions on GitHub](https://github.com/stacksjs/ts-validation/discussions)

For casual chit-chat with others using this package:

[Join the Stacks Discord Server](https://discord.gg/stacksjs)

## Credits

- [validator.js](https://github.com/validatorjs/validator.js) - for the original string validation functions

## Postcardware

"Software that is free, but hopes for a postcard." We love receiving postcards from around the world showing where Stacks is being used! We showcase them on our website too.

Our address: Stacks.js, 12665 Village Ln #2306, Playa Vista, CA 90094, United States 🌎

## Sponsors

We would like to extend our thanks to the following sponsors for funding Stacks development. If you are interested in becoming a sponsor, please reach out to us.

- [JetBrains](https://www.jetbrains.com/)
- [The Solana Foundation](https://solana.com/)

## License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with 💙

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@stacksjs/ts-validation?style=flat-square
[npm-version-href]: https://npmjs.com/package/@stacksjs/ts-validation
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/stacksjs/ts-validation/ci.yml?style=flat-square&branch=main
[github-actions-href]: https://github.com/stacksjs/ts-validation/actions?query=workflow%3Aci

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/stacksjs/ts-validation/main?style=flat-square
[codecov-href]: https://codecov.io/gh/stacksjs/ts-validation -->
