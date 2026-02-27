# Validation Schemas

Advanced schema patterns for complex validation scenarios.

## Overview

ts-validation schemas can handle complex data structures, conditional validation, and schema composition for enterprise applications.

## Nested Schemas

Validate deeply nested objects:

```typescript
const addressSchema = {
  street: string().required(),
  city: string().required(),
  state: string().length(2),
  zip: string().pattern(/^\d{5}(-\d{4})?$/),
  country: string().default('US'),
}

const userSchema = {
  name: string().required(),
  addresses: {
    home: object(addressSchema).required(),
    work: object(addressSchema).optional(),
    shipping: array(object(addressSchema)),
  },
}
```

## Schema Composition

Combine and extend schemas:

```typescript
import { merge, pick, omit, extend } from 'ts-validation'

const baseUserSchema = {
  id: string().uuid(),
  email: string().email().required(),
  name: string().required(),
  createdAt: date(),
}

// Pick specific fields
const loginSchema = pick(baseUserSchema, ['email'])

// Omit fields
const createUserSchema = omit(baseUserSchema, ['id', 'createdAt'])

// Extend with additional fields
const adminSchema = extend(baseUserSchema, {
  role: literal('admin'),
  permissions: array(string()),
})

// Merge multiple schemas
const fullProfileSchema = merge(baseUserSchema, {
  bio: string().maxLength(500),
  avatar: string().url(),
})
```

## Discriminated Unions

Handle polymorphic data:

```typescript
const notificationSchema = discriminatedUnion('type', {
  email: {
    type: literal('email'),
    to: string().email(),
    subject: string().required(),
    body: string().required(),
  },
  sms: {
    type: literal('sms'),
    phone: string().phone(),
    message: string().maxLength(160),
  },
  push: {
    type: literal('push'),
    deviceToken: string().required(),
    title: string().required(),
    body: string().optional(),
  },
})
```

## Recursive Schemas

Handle self-referential data:

```typescript
import { lazy } from 'ts-validation'

interface TreeNode {
  value: string
  children?: TreeNode[]
}

const treeSchema = {
  value: string().required(),
  children: lazy(() => array(object(treeSchema))).optional(),
}
```

## Conditional Schemas

Apply different validation based on conditions:

```typescript
const paymentSchema = {
  method: string().oneOf(['card', 'bank', 'crypto']),

  // Card-specific fields
  cardNumber: string().when('method', {
    is: 'card',
    then: (s) => s.creditCard().required(),
    otherwise: (s) => s.forbidden(),
  }),

  // Bank-specific fields
  accountNumber: string().when('method', {
    is: 'bank',
    then: (s) => s.required().minLength(10),
    otherwise: (s) => s.forbidden(),
  }),

  // Crypto-specific fields
  walletAddress: string().when('method', {
    is: 'crypto',
    then: (s) => s.required().pattern(/^0x[a-fA-F0-9]{40}$/),
    otherwise: (s) => s.forbidden(),
  }),
}
```

## Schema Versioning

Handle multiple API versions:

```typescript
const userSchemaV1 = {
  name: string().required(),
  email: string().email(),
}

const userSchemaV2 = extend(userSchemaV1, {
  firstName: string().required(),
  lastName: string().required(),
  name: string().forbidden(), // Deprecated in v2
})

function getSchema(version: number) {
  return version >= 2 ? userSchemaV2 : userSchemaV1
}
```

## JSON Schema Export

Export schemas for documentation:

```typescript
import { toJsonSchema } from 'ts-validation'

const userSchema = {
  name: string().required().minLength(2),
  email: string().email().required(),
  age: number().min(0).max(150),
}

const jsonSchema = toJsonSchema(userSchema)
// Generates standard JSON Schema for OpenAPI docs
```
