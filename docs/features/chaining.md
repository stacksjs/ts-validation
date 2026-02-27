# Chained Validators

ts-validation supports fluent, chainable validation rules that make complex validation logic readable and maintainable.

## Overview

Chaining allows you to combine multiple validation rules on a single field, with each rule adding constraints to the validation.

## Basic Chaining

```typescript
import { string, number } from 'ts-validation'

// Chain multiple string validators
const username = string()
  .required()
  .minLength(3)
  .maxLength(20)
  .alphanumeric()
  .lowercase()

// Chain multiple number validators
const price = number()
  .required()
  .positive()
  .max(10000)
  .precision(2)
```

## Order of Execution

Validators execute in the order they are chained. This matters for transformations:

```typescript
// Trim first, then check length
const trimmedName = string()
  .trim()           // Removes whitespace
  .minLength(2)     // Checks trimmed length

// Lowercase first, then check pattern
const normalizedEmail = string()
  .lowercase()      // Converts to lowercase
  .email()          // Validates email format
```

## Conditional Chaining

Use conditional methods for dynamic validation:

```typescript
const conditionalField = string()
  .when('userType', {
    is: 'business',
    then: (schema) => schema.required().minLength(5),
    otherwise: (schema) => schema.optional(),
  })
```

## Custom Chain Methods

Add custom validation to the chain:

```typescript
const password = string()
  .required()
  .minLength(8)
  .custom((value) => {
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)

    if (!hasUpper || !hasLower || !hasNumber) {
      return 'Password must contain uppercase, lowercase, and numbers'
    }
    return true
  })
```

## Short-Circuit Evaluation

Validation stops at the first failure by default:

```typescript
const field = string()
  .required()      // If this fails, stops here
  .minLength(5)    // Only checked if required passes
  .email()         // Only checked if minLength passes

// Enable full validation to get all errors
const result = validate(schema, data, { abortEarly: false })
```

## Combining with Transformations

Chain transformations with validations:

```typescript
const normalizedPhone = string()
  .transform((v) => v.replace(/\D/g, ''))  // Remove non-digits
  .length(10)                               // Must be 10 digits
  .transform((v) => `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`)
```
