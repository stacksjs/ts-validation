# Type-Safe Validation

ts-validation provides complete TypeScript type inference for your validation rules, ensuring compile-time safety and excellent IDE support.

## Overview

Type-safe validation means that TypeScript can infer the output type of your validated data based on your validation schema. This eliminates runtime type errors and provides excellent autocomplete support.

## Basic Type Inference

```typescript
import { validate, string, number, email } from 'ts-validation'

// Define your schema
const userSchema = {
  name: string().required(),
  age: number().min(0).max(150),
  email: email().required(),
}

// TypeScript infers the result type automatically
const result = validate(userSchema, data)

if (result.valid) {
  // result.data is typed as { name: string; age: number; email: string }
  console.log(result.data.name) // TypeScript knows this is a string
}
```

## Extracting Schema Types

You can extract the TypeScript type from any schema:

```typescript
import { InferSchema } from 'ts-validation'

const productSchema = {
  id: string().uuid(),
  price: number().positive(),
  tags: array(string()),
}

// Extract the type
type Product = InferSchema<typeof productSchema>
// Result: { id: string; price: number; tags: string[] }

// Use in function signatures
function createProduct(product: Product): void {
  // ...
}
```

## Nullable and Optional Types

Type inference correctly handles nullable and optional fields:

```typescript
const schema = {
  required: string().required(),    // Type: string
  optional: string().optional(),    // Type: string | undefined
  nullable: string().nullable(),    // Type: string | null
  both: string().optional().nullable(), // Type: string | null | undefined
}
```

## Union Types

Create discriminated unions with type-safe validation:

```typescript
import { union, literal, string, number } from 'ts-validation'

const paymentSchema = union([
  {
    type: literal('credit_card'),
    cardNumber: string().creditCard(),
    expiry: string().pattern(/^\d{2}\/\d{2}$/),
  },
  {
    type: literal('bank_transfer'),
    accountNumber: string().minLength(10),
    routingNumber: string().length(9),
  },
])

// TypeScript knows the discriminated union type
type Payment = InferSchema<typeof paymentSchema>
```

## Best Practices

1. **Define schemas as constants** to enable type inference
2. **Use `as const`** for literal values when needed
3. **Extract types early** to use throughout your application
4. **Leverage IDE autocomplete** for discovering available validators
