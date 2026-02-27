# Performance Optimization

Optimize ts-validation for high-throughput scenarios and large-scale applications.

## Overview

ts-validation is designed for performance, but understanding how to use it optimally can yield significant improvements in demanding applications.

## Schema Compilation

Pre-compile schemas for repeated use:

```typescript
import { compile, string, number } from 'ts-validation'

// Compile once at startup
const validateUser = compile({
  name: string().required(),
  email: string().email(),
  age: number().positive(),
})

// Use the compiled validator (faster than validate())
const result = validateUser(userData)
```

## Benchmark Comparison

```typescript
// Uncompiled (slower for repeated validations)
for (const user of users) {
  validate(schema, user) // Schema parsed each time
}

// Compiled (faster for repeated validations)
const validator = compile(schema)
for (const user of users) {
  validator(user) // Uses pre-compiled validator
}
```

## Lazy Validation

Skip validation for trusted data:

```typescript
import { validateIf } from 'ts-validation'

// Only validate if condition is met
const result = validateIf(
  schema,
  data,
  process.env.NODE_ENV !== 'production'
)
```

## Partial Validation

Validate only specific fields:

```typescript
import { validatePartial } from 'ts-validation'

// Only validate 'email' and 'name' fields
const result = validatePartial(schema, data, ['email', 'name'])
```

## Memory Optimization

For large schemas, use schema references:

```typescript
const addressSchema = {
  street: string().required(),
  city: string().required(),
  zip: string().pattern(/^\d{5}$/),
}

// Reference instead of duplicating
const userSchema = {
  name: string().required(),
  homeAddress: ref(addressSchema),
  workAddress: ref(addressSchema),
}
```

## Batching Validations

Process multiple items efficiently:

```typescript
import { validateBatch } from 'ts-validation'

// Validate array of items with shared compiled schema
const results = validateBatch(schema, arrayOfUsers)

// Results array with same order as input
results.forEach((result, index) => {
  if (!result.valid) {
    console.log(`User ${index} failed:`, result.errors)
  }
})
```

## Profiling Validation

Measure validation performance:

```typescript
import { validateWithMetrics } from 'ts-validation'

const result = validateWithMetrics(schema, data)

console.log(`Validation took: ${result.metrics.duration}ms`)
console.log(`Rules checked: ${result.metrics.rulesChecked}`)
```

## Best Practices

1. **Compile schemas** used more than once
2. **Avoid deep nesting** when possible
3. **Use short-circuit validation** (`abortEarly: true`) for forms
4. **Cache compiled validators** at module level
5. **Profile before optimizing** to identify actual bottlenecks
