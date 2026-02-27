# Edge Cases

Handle unusual validation scenarios and edge cases effectively.

## Overview

Real-world applications encounter edge cases that require special handling. This guide covers common edge cases and how to handle them with ts-validation.

## Null vs Undefined

Handle the difference between null and undefined:

```typescript
const schema = {
  // Only accepts actual values, rejects null and undefined
  required: string().required(),

  // Accepts undefined but not null
  optional: string().optional(),

  // Accepts null but not undefined
  nullable: string().nullable(),

  // Accepts both null and undefined
  maybeNull: string().optional().nullable(),

  // Has a default when undefined, but accepts null
  withDefault: string().default('N/A').nullable(),
}
```

## Empty Strings

Handle empty strings explicitly:

```typescript
// Empty string passes string() but fails required()
const schema1 = {
  name: string(), // '' is valid
}

// Reject empty strings
const schema2 = {
  name: string().minLength(1), // '' fails
}

// Treat empty strings as undefined
const schema3 = {
  name: string().transform((v) => v || undefined).required(),
}
```

## Whitespace Handling

```typescript
const schema = {
  // Trim before validation
  trimmed: string().trim().minLength(3),

  // Validate includes whitespace
  preserved: string().minLength(3),

  // Collapse multiple spaces
  normalized: string().transform((v) =>
    v.replace(/\s+/g, ' ').trim()
  ),
}
```

## Number Edge Cases

```typescript
const schema = {
  // Handle NaN
  safeNumber: number().custom((v) => !Number.isNaN(v) || 'Invalid number'),

  // Handle Infinity
  finiteNumber: number().custom((v) => Number.isFinite(v) || 'Must be finite'),

  // Handle floating point precision
  price: number().precision(2).transform((v) =>
    Math.round(v * 100) / 100
  ),

  // Handle negative zero
  positiveOrZero: number().min(0).transform((v) => v === 0 ? 0 : v),
}
```

## Date Edge Cases

```typescript
const schema = {
  // Accept various date formats
  flexibleDate: date().transform((v) => {
    if (typeof v === 'string') return new Date(v)
    if (typeof v === 'number') return new Date(v)
    return v
  }),

  // Validate date is not in the past
  futureDate: date().custom((v) => v > new Date() || 'Must be in the future'),

  // Handle timezone-aware dates
  utcDate: date().transform((v) => new Date(v.toISOString())),
}
```

## Array Edge Cases

```typescript
const schema = {
  // Empty arrays
  allowEmpty: array(string()),
  requireItems: array(string()).minLength(1),

  // Unique items
  uniqueTags: array(string()).unique(),

  // Handle sparse arrays
  denseArray: array(number()).transform((arr) => arr.filter(Boolean)),

  // Nested arrays
  matrix: array(array(number())),
}
```

## Circular References

```typescript
// Handle circular data structures
const schema = object({
  id: string(),
  parent: lazy(() => schema).optional(),
})

// Detect circular references during validation
const result = validate(schema, data, { detectCircular: true })
```

## Type Coercion

```typescript
const schema = {
  // Coerce string to number
  age: number().coerce(), // '25' becomes 25

  // Coerce to boolean
  active: boolean().coerce(), // 'true', '1', 1 become true

  // Coerce to date
  createdAt: date().coerce(), // ISO string becomes Date

  // Custom coercion
  tags: array(string()).transform((v) =>
    typeof v === 'string' ? v.split(',') : v
  ),
}
```

## Error Accumulation

```typescript
// Get all errors instead of stopping at first
const result = validate(schema, data, { abortEarly: false })

// Errors by field
console.log(result.errors)
// { name: ['Required'], email: ['Invalid email', 'Too short'] }

// Flat error list
console.log(result.allErrors)
// ['name: Required', 'email: Invalid email', 'email: Too short']
```

## Unknown Fields

```typescript
// Strict mode - reject unknown fields
const strictSchema = object({
  name: string(),
}).strict()

// Strip unknown fields
const strippedSchema = object({
  name: string(),
}).strip()

// Pass through unknown fields
const passSchema = object({
  name: string(),
}).passthrough()
```
