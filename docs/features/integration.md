# Framework Integration

ts-validation integrates seamlessly with popular frameworks and libraries for form validation, API validation, and more.

## Express.js Integration

Use ts-validation as Express middleware:

```typescript
import express from 'express'
import { validate, string, number } from 'ts-validation'

const app = express()

// Validation middleware factory
function validateBody(schema: any) {
  return (req, res, next) => {
    const result = validate(schema, req.body)
    if (!result.valid) {
      return res.status(400).json({ errors: result.errors })
    }
    req.validatedBody = result.data
    next()
  }
}

// Usage
const createUserSchema = {
  name: string().required().minLength(2),
  email: string().email().required(),
  age: number().min(18).optional(),
}

app.post('/users', validateBody(createUserSchema), (req, res) => {
  // req.validatedBody is typed and validated
  createUser(req.validatedBody)
})
```

## Hono Integration

```typescript
import { Hono } from 'hono'
import { validate, string } from 'ts-validation'

const app = new Hono()

// Middleware for Hono
const validateRequest = (schema: any) => async (c, next) => {
  const body = await c.req.json()
  const result = validate(schema, body)

  if (!result.valid) {
    return c.json({ errors: result.errors }, 400)
  }

  c.set('validated', result.data)
  await next()
}

app.post('/api/users', validateRequest(userSchema), (c) => {
  const data = c.get('validated')
  // Process validated data
})
```

## Vue.js Integration

Use with Vue forms:

```typescript
<script setup lang="ts">
import { ref, computed } from 'vue'
import { validate, string, email } from 'ts-validation'

const formSchema = {
  username: string().required().minLength(3),
  email: email().required(),
}

const form = ref({ username: '', email: '' })
const errors = ref({})

const isValid = computed(() => {
  const result = validate(formSchema, form.value)
  errors.value = result.errors
  return result.valid
})

const submit = () => {
  if (isValid.value) {
    // Submit form
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <input v-model="form.username" />
    <span v-if="errors.username">{{ errors.username }}</span>

    <input v-model="form.email" type="email" />
    <span v-if="errors.email">{{ errors.email }}</span>

    <button :disabled="!isValid">Submit</button>
  </form>
</template>
```

## React Integration

```typescript
import { useState, useMemo } from 'react'
import { validate, string } from 'ts-validation'

const schema = {
  email: string().email().required(),
  password: string().minLength(8).required(),
}

function LoginForm() {
  const [form, setForm] = useState({ email: '', password: '' })

  const validation = useMemo(() => validate(schema, form), [form])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validation.valid) {
      login(validation.data)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      {validation.errors.email && <span>{validation.errors.email}</span>}

      <button disabled={!validation.valid}>Login</button>
    </form>
  )
}
```

## Zod Compatibility

ts-validation provides a Zod-compatible API:

```typescript
import { z } from 'ts-validation/compat'

const schema = z.object({
  name: z.string().min(1),
  age: z.number().positive(),
})

type User = z.infer<typeof schema>
```
