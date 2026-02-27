# Custom Rule Extensions

Extend ts-validation with custom validation rules tailored to your application's needs.

## Overview

While ts-validation provides comprehensive built-in validators, you may need domain-specific rules for your application. The extension system allows you to create reusable custom validators.

## Creating Custom Rules

Define a custom rule with full TypeScript support:

```typescript
import { createRule, ValidationContext } from 'ts-validation'

// Simple custom rule
const isSlug = createRule<string>({
  name: 'slug',
  message: 'Must be a valid URL slug',
  validate: (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
})

// Usage
const articleSchema = {
  title: string().required(),
  slug: string().custom(isSlug),
}
```

## Rules with Parameters

Create configurable rules:

```typescript
const divisibleBy = createRule<number, [number]>({
  name: 'divisibleBy',
  message: (divisor) => `Must be divisible by ${divisor}`,
  validate: (value, divisor) => value % divisor === 0,
})

// Usage
const schema = {
  quantity: number().custom(divisibleBy(5)), // Must be divisible by 5
}
```

## Rules with Context

Access validation context in custom rules:

```typescript
const uniqueInArray = createRule<string>({
  name: 'uniqueInArray',
  message: 'Duplicate value found',
  validate: (value, context: ValidationContext) => {
    const array = context.parent as string[]
    const count = array.filter((v) => v === value).length
    return count === 1
  },
})
```

## Extending Built-in Types

Add methods to built-in validators:

```typescript
import { extendString } from 'ts-validation'

// Add custom method to string validator
extendString('isUsername', {
  message: 'Must be a valid username',
  validate: (value) => {
    return /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/.test(value)
  },
})

// Now available on all string validators
const schema = {
  username: string().isUsername(),
}
```

## Creating Validator Plugins

Package multiple rules as a plugin:

```typescript
import { createPlugin } from 'ts-validation'

export const ecommercePlugin = createPlugin({
  name: 'ecommerce',
  rules: {
    sku: {
      message: 'Invalid SKU format',
      validate: (v) => /^[A-Z]{3}-\d{6}$/.test(v),
    },
    upc: {
      message: 'Invalid UPC code',
      validate: (v) => /^\d{12}$/.test(v) && isValidUpcChecksum(v),
    },
    price: {
      message: 'Invalid price format',
      validate: (v) => typeof v === 'number' && v >= 0,
    },
  },
})

// Register the plugin
import { registerPlugin } from 'ts-validation'
registerPlugin(ecommercePlugin)

// Use plugin rules
const productSchema = {
  sku: string().sku(),
  upc: string().upc(),
  price: number().price(),
}
```

## Async Custom Rules

Create async validation rules:

```typescript
const isUniqueEmail = createAsyncRule<string>({
  name: 'uniqueEmail',
  message: 'Email already exists',
  validate: async (value) => {
    const exists = await db.users.findByEmail(value)
    return !exists
  },
})
```

## Testing Custom Rules

Write tests for your custom rules:

```typescript
import { test, expect } from 'bun:test'
import { string, validate } from 'ts-validation'

test('slug validation', () => {
  const schema = { slug: string().custom(isSlug) }

  expect(validate(schema, { slug: 'valid-slug' }).valid).toBe(true)
  expect(validate(schema, { slug: 'Invalid Slug' }).valid).toBe(false)
  expect(validate(schema, { slug: 'no--double' }).valid).toBe(false)
})
```
