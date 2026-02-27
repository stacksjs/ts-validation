# Async Validation

ts-validation supports asynchronous validation for scenarios that require external data lookups, API calls, or database checks.

## Overview

Async validators allow you to perform validation that depends on external resources, such as checking if a username is already taken or validating against a remote API.

## Basic Async Validation

```typescript
import { string, validateAsync } from 'ts-validation'

const usernameSchema = {
  username: string()
    .required()
    .minLength(3)
    .asyncCustom(async (value) => {
      const exists = await checkUsernameExists(value)
      if (exists) {
        return 'Username is already taken'
      }
      return true
    }),
}

// Use validateAsync for schemas with async validators
const result = await validateAsync(usernameSchema, { username: 'john' })
```

## Async with Database Lookups

```typescript
const emailSchema = {
  email: string()
    .email()
    .asyncCustom(async (value, context) => {
      // Skip check for existing users updating their email
      if (context.data.userId) {
        const user = await db.users.findById(context.data.userId)
        if (user.email === value) return true
      }

      const existing = await db.users.findByEmail(value)
      return existing ? 'Email already registered' : true
    }),
}
```

## Parallel Async Validation

Multiple async validators run in parallel by default:

```typescript
const registrationSchema = {
  username: string().asyncCustom(checkUsername),
  email: string().asyncCustom(checkEmail),
  referralCode: string().optional().asyncCustom(validateReferralCode),
}

// All three async validators run concurrently
const result = await validateAsync(registrationSchema, data)
```

## Async with Timeout

Protect against slow validators:

```typescript
const schema = {
  externalId: string().asyncCustom(async (value) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
      const response = await fetch(`/api/validate/${value}`, {
        signal: controller.signal,
      })
      return response.ok ? true : 'Invalid external ID'
    } catch (error) {
      if (error.name === 'AbortError') {
        return 'Validation timed out'
      }
      throw error
    } finally {
      clearTimeout(timeout)
    }
  }),
}
```

## Caching Async Results

Optimize repeated validations:

```typescript
const cache = new Map<string, boolean>()

const cachedValidator = async (value: string) => {
  if (cache.has(value)) {
    return cache.get(value) ? true : 'Invalid value'
  }

  const isValid = await externalValidation(value)
  cache.set(value, isValid)

  return isValid ? true : 'Invalid value'
}
```

## Error Handling

Handle async validation errors gracefully:

```typescript
try {
  const result = await validateAsync(schema, data)
  if (result.valid) {
    // Process valid data
  } else {
    // Handle validation errors
  }
} catch (error) {
  // Handle unexpected errors (network issues, etc.)
  console.error('Validation failed unexpectedly:', error)
}
```
