# Error Messages

When using ts-validation in applications, you'll often need to provide meaningful error messages to users. This guide covers strategies for creating and managing validation error messages.

## Basic Error Handling

The simplest approach is to check validation results and return appropriate messages:

```typescript
import validator from 'ts-validation'

function validateEmail(email: string): string | null {
  if (!email || email.length === 0) {
    return 'Email is required'
  }

  if (!validator.isEmail(email)) {
    return 'Please enter a valid email address'
  }

  return null // No error
}

// Usage
const error = validateEmail('invalid')
if (error) {
  console.log(error) // 'Please enter a valid email address'
}
```

## Message Templates

Create reusable message templates for consistent error messages:

```typescript
const messages = {
  required: (field: string) => `${field} is required`,
  minLength: (field: string, min: number) =>
    `${field} must be at least ${min} characters`,
  maxLength: (field: string, max: number) =>
    `${field} must be at most ${max} characters`,
  email: () => 'Please enter a valid email address',
  url: () => 'Please enter a valid URL',
  phone: () => 'Please enter a valid phone number',
  creditCard: () => 'Please enter a valid credit card number',
  pattern: (field: string) => `${field} format is invalid`,
}

// Usage
function validateUsername(username: string): string | null {
  if (!username) {
    return messages.required('Username')
  }

  if (username.length < 3) {
    return messages.minLength('Username', 3)
  }

  if (username.length > 20) {
    return messages.maxLength('Username', 20)
  }

  return null
}
```

## Internationalization (i18n)

Support multiple languages with a message dictionary:

```typescript
type Locale = 'en' | 'es' | 'fr' | 'de'

interface MessageDictionary {
  required: string
  email: string
  minLength: string
  maxLength: string
  phone: string
  url: string
}

const messages: Record<Locale, MessageDictionary> = {
  en: {
    required: '{field} is required',
    email: 'Please enter a valid email address',
    minLength: '{field} must be at least {min} characters',
    maxLength: '{field} must be at most {max} characters',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
  },
  es: {
    required: '{field} es obligatorio',
    email: 'Por favor ingrese un correo valido',
    minLength: '{field} debe tener al menos {min} caracteres',
    maxLength: '{field} debe tener como maximo {max} caracteres',
    phone: 'Por favor ingrese un numero de telefono valido',
    url: 'Por favor ingrese una URL valida',
  },
  fr: {
    required: '{field} est requis',
    email: 'Veuillez entrer une adresse email valide',
    minLength: '{field} doit contenir au moins {min} caracteres',
    maxLength: '{field} doit contenir au maximum {max} caracteres',
    phone: 'Veuillez entrer un numero de telephone valide',
    url: 'Veuillez entrer une URL valide',
  },
  de: {
    required: '{field} ist erforderlich',
    email: 'Bitte geben Sie eine gultige E-Mail-Adresse ein',
    minLength: '{field} muss mindestens {min} Zeichen haben',
    maxLength: '{field} darf hochstens {max} Zeichen haben',
    phone: 'Bitte geben Sie eine gultige Telefonnummer ein',
    url: 'Bitte geben Sie eine gultige URL ein',
  },
}

function createMessageFormatter(locale: Locale) {
  const dict = messages[locale]

  return {
    format(
      key: keyof MessageDictionary,
      params: Record<string, string | number> = {}
    ): string {
      let message = dict[key]

      for (const [param, value] of Object.entries(params)) {
        message = message.replace(`{${param}}`, String(value))
      }

      return message
    },
  }
}

// Usage
const formatter = createMessageFormatter('es')
console.log(formatter.format('required', { field: 'Email' }))
// 'Email es obligatorio'

console.log(formatter.format('minLength', { field: 'Contrasena', min: 8 }))
// 'Contrasena debe tener al menos 8 caracteres'
```

## Validation Result Objects

Return structured validation results with error details:

```typescript
interface ValidationError {
  field: string
  code: string
  message: string
  value?: any
}

interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

function validateForm(data: Record<string, any>): ValidationResult {
  const errors: ValidationError[] = []

  // Validate email
  if (!data.email) {
    errors.push({
      field: 'email',
      code: 'REQUIRED',
      message: 'Email is required',
    })
  } else if (!validator.isEmail(data.email)) {
    errors.push({
      field: 'email',
      code: 'INVALID_EMAIL',
      message: 'Please enter a valid email address',
      value: data.email,
    })
  }

  // Validate password
  if (!data.password) {
    errors.push({
      field: 'password',
      code: 'REQUIRED',
      message: 'Password is required',
    })
  } else if (data.password.length < 8) {
    errors.push({
      field: 'password',
      code: 'MIN_LENGTH',
      message: 'Password must be at least 8 characters',
      value: data.password.length,
    })
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Usage
const result = validateForm({ email: 'invalid', password: '123' })
// {
//   isValid: false,
//   errors: [
//     { field: 'email', code: 'INVALID_EMAIL', message: '...', value: 'invalid' },
//     { field: 'password', code: 'MIN_LENGTH', message: '...', value: 3 }
//   ]
// }
```

## Field-Level Validation

Validate individual fields with custom messages:

```typescript
import validator from 'ts-validation'

interface FieldValidator {
  validate: (value: any) => boolean
  message: string | ((value: any) => string)
}

interface FieldConfig {
  validators: FieldValidator[]
}

function createFieldValidator(config: FieldConfig) {
  return function validate(value: any): string[] {
    const errors: string[] = []

    for (const { validate, message } of config.validators) {
      if (!validate(value)) {
        errors.push(
          typeof message === 'function' ? message(value) : message
        )
      }
    }

    return errors
  }
}

// Define field validators
const emailValidator = createFieldValidator({
  validators: [
    {
      validate: (v) => v && v.length > 0,
      message: 'Email is required',
    },
    {
      validate: (v) => validator.isEmail(v),
      message: 'Please enter a valid email address',
    },
    {
      validate: (v) => v.length <= 255,
      message: (v) => `Email is too long (${v.length}/255 characters)`,
    },
  ],
})

// Usage
const errors = emailValidator('invalid-email')
// ['Please enter a valid email address']
```

## Contextual Messages

Provide context-specific error messages:

```typescript
type Context = 'registration' | 'login' | 'profile'

const contextualMessages: Record<Context, Record<string, string>> = {
  registration: {
    email_required: 'Please provide an email to create your account',
    email_invalid: 'This email address appears to be invalid',
    email_taken: 'This email is already registered. Try logging in instead.',
    password_weak: 'Please choose a stronger password to protect your account',
  },
  login: {
    email_required: 'Please enter your email address',
    email_invalid: 'Please check your email address',
    password_required: 'Please enter your password',
  },
  profile: {
    email_required: 'Email address cannot be empty',
    email_invalid: 'Please enter a valid email address',
    email_taken: 'This email is already in use by another account',
  },
}

function getMessage(context: Context, key: string): string {
  return contextualMessages[context]?.[key] || `Validation error: ${key}`
}

// Usage
console.log(getMessage('registration', 'email_taken'))
// 'This email is already registered. Try logging in instead.'

console.log(getMessage('login', 'email_required'))
// 'Please enter your email address'
```

## User-Friendly Messages

Transform technical validation errors into user-friendly messages:

```typescript
const userFriendlyMessages: Record<string, string> = {
  // Email
  'isEmail': 'That doesn\'t look like a valid email address. Please check for typos.',

  // Password
  'isStrongPassword.minLength': 'Your password is a bit short. Try making it at least 8 characters.',
  'isStrongPassword.minLowercase': 'Add at least one lowercase letter to your password.',
  'isStrongPassword.minUppercase': 'Add at least one uppercase letter to your password.',
  'isStrongPassword.minNumbers': 'Add at least one number to your password.',
  'isStrongPassword.minSymbols': 'Add a special character (like !, @, #) to make your password stronger.',

  // Credit Card
  'isCreditCard': 'This doesn\'t appear to be a valid card number. Please double-check.',

  // Phone
  'isMobilePhone': 'Please enter a valid phone number including area code.',

  // URL
  'isURL': 'Please enter a complete URL starting with http:// or https://',

  // General
  'required': 'This field is required.',
  'minLength': 'Please enter at least {min} characters.',
  'maxLength': 'Please keep this under {max} characters.',
}

function getUserFriendlyMessage(
  rule: string,
  params: Record<string, any> = {}
): string {
  let message = userFriendlyMessages[rule] || 'Please check this field.'

  for (const [key, value] of Object.entries(params)) {
    message = message.replace(`{${key}}`, String(value))
  }

  return message
}

// Usage
console.log(getUserFriendlyMessage('isEmail'))
// "That doesn't look like a valid email address. Please check for typos."

console.log(getUserFriendlyMessage('minLength', { min: 8 }))
// "Please enter at least 8 characters."
```

## Inline Hints

Provide helpful hints alongside error messages:

```typescript
interface FieldMessage {
  error?: string
  hint?: string
  example?: string
}

const fieldMessages: Record<string, FieldMessage> = {
  email: {
    error: 'Please enter a valid email address',
    hint: 'We\'ll never share your email with anyone else',
    example: 'example@company.com',
  },
  phone: {
    error: 'Please enter a valid phone number',
    hint: 'Include your country code for international numbers',
    example: '+1 (555) 123-4567',
  },
  password: {
    error: 'Password doesn\'t meet requirements',
    hint: 'Use a mix of letters, numbers, and symbols',
    example: 'MyS3cur3P@ss!',
  },
  url: {
    error: 'Please enter a valid URL',
    hint: 'Include the full URL with http:// or https://',
    example: 'https://example.com',
  },
}

function getFieldMessages(field: string): FieldMessage {
  return fieldMessages[field] || { error: 'Invalid value' }
}

// Usage in a form component
const emailMessages = getFieldMessages('email')
// Display hint: "We'll never share your email with anyone else"
// On error: "Please enter a valid email address"
// Placeholder: "example@company.com"
```

## Real-Time Validation Feedback

Provide immediate feedback as users type:

```typescript
interface RealtimeFeedback {
  type: 'error' | 'warning' | 'success' | 'info'
  message: string
}

function getRealtimeFeedback(
  field: string,
  value: string
): RealtimeFeedback | null {
  if (!value) {
    return null // Don't show feedback for empty fields
  }

  switch (field) {
    case 'email':
      if (!value.includes('@')) {
        return { type: 'info', message: 'Email addresses contain @' }
      }
      if (!validator.isEmail(value)) {
        return { type: 'error', message: 'Please check your email format' }
      }
      return { type: 'success', message: 'Email looks good!' }

    case 'password':
      const strength = getPasswordStrength(value)
      if (strength < 2) {
        return { type: 'error', message: 'Weak password - add more characters' }
      }
      if (strength < 4) {
        return { type: 'warning', message: 'Moderate - try adding symbols' }
      }
      return { type: 'success', message: 'Strong password!' }

    case 'username':
      if (value.length < 3) {
        return { type: 'info', message: `${3 - value.length} more characters needed` }
      }
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        return { type: 'error', message: 'Only letters, numbers, and underscores' }
      }
      return { type: 'success', message: 'Username available!' }

    default:
      return null
  }
}

function getPasswordStrength(password: string): number {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[a-z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[^A-Za-z0-9]/.test(password)) strength++
  return strength
}
```

## Accessibility Considerations

Ensure error messages are accessible:

```typescript
interface AccessibleError {
  id: string
  message: string
  ariaDescribedBy: string
  role: 'alert' | 'status'
}

function createAccessibleError(
  fieldId: string,
  message: string,
  isImmediate: boolean = true
): AccessibleError {
  const errorId = `${fieldId}-error`

  return {
    id: errorId,
    message,
    ariaDescribedBy: errorId,
    role: isImmediate ? 'alert' : 'status',
  }
}

// Usage in HTML/JSX
// <input
//   id="email"
//   aria-describedby={error.ariaDescribedBy}
//   aria-invalid={!!error}
// />
// <span id={error.id} role={error.role}>
//   {error.message}
// </span>
```

## Best Practices

### 1. Be Specific

```typescript
// Good - specific and actionable
'Password must contain at least one uppercase letter'

// Bad - vague
'Invalid password'
```

### 2. Be Positive

```typescript
// Good - tells user what to do
'Please enter a valid email address'

// Bad - focuses on what's wrong
'Email is invalid'
```

### 3. Keep It Short

```typescript
// Good - concise
'Email is required'

// Bad - too wordy
'The email address field is a required field and must be filled in before you can continue'
```

### 4. Avoid Technical Jargon

```typescript
// Good - user-friendly
'Please enter a stronger password'

// Bad - technical
'Password fails regex validation for security policy'
```

### 5. Provide Examples When Helpful

```typescript
// Good - shows expected format
'Please enter a date (e.g., 01/15/2024)'

// Bad - no guidance
'Invalid date format'
```
