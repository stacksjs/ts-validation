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
const userValidator = v.object().shape({
  name: v.string().min(2).max(50).required(),
  email: v.string().email().required(),
  age: v.number().min(18).integer().required(),
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
```

### Number Validation

```typescript
// Basic number validation
const ageValidator = v.number().min(18).max(120).required()

// Integer validation
const quantityValidator = v.number().integer().positive().required()

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
const addressValidator = v.object().shape({
  street: v.string().required(),
  city: v.string().required(),
  state: v.string().length(2).required(),
  zip: v.string().matches(/^\d{5}$/).required(),
})

// Nested object validation
const userValidator = v.object().shape({
  name: v.string().required(),
  address: addressValidator,
})

// Strict object validation (no extra fields allowed)
const strictValidator = v.object().strict().shape({
  id: v.number().required(),
  name: v.string().required(),
})
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

- Minimum and maximum length
- Must contain both letters and numbers (alphanumeric)
- Must have uppercase and lowercase letters
- Must contain special characters
- Can validate password matches (for confirmation)

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

### Date and Time Validation

The library provides several date and time validators to handle different formats:

- Basic JavaScript Date objects
- MySQL DATETIME format (1000-01-01 to 9999-12-31)
- Unix timestamps (both seconds and milliseconds)
- MySQL TIMESTAMP format (1970-01-01 00:00:00 UTC to 2038-01-19 03:14:07 UTC)

```typescript
// Basic date validation
const dateValidator = v.date()
expect(dateValidator.test(new Date())).toBe(true)
expect(dateValidator.test(new Date('invalid'))).toBe(false)

// Datetime validation (MySQL DATETIME compatible)
const datetimeValidator = v.datetime()
expect(datetimeValidator.test(new Date('2023-01-01'))).toBe(true)
expect(datetimeValidator.test(new Date('0999-12-31'))).toBe(false) // Before 1000-01-01
expect(datetimeValidator.test(new Date('10000-01-01'))).toBe(false) // After 9999-12-31

// Unix timestamp validation
const unixValidator = v.unix()
expect(unixValidator.test(1683912345)).toBe(true) // Seconds
expect(unixValidator.test(1683912345000)).toBe(true) // Milliseconds
expect(unixValidator.test(-1)).toBe(false) // Invalid negative timestamp

// Regular timestamp validation (MySQL TIMESTAMP compatible)
const timestampValidator = v.timestamp()
expect(timestampValidator.test(0)).toBe(true) // 1970-01-01 00:00:00 UTC
expect(timestampValidator.test(2147483647)).toBe(true) // 2038-01-19 03:14:07 UTC
expect(timestampValidator.test(-1)).toBe(false) // Invalid negative timestamp
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

## Performance Tips

1. **Use caching**: Enable `cacheResults` in the config for repeated validations
2. **Early returns**: Set `strictMode: true` to stop on first error when validating complex objects
3. **Reuse validators**: Create validators once and reuse them instead of creating new ones for each validation

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
