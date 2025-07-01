import { MessageProvider, setMessagesProvider, v } from '../src'

// Set up custom messages with field-specific overrides
setMessagesProvider(new MessageProvider({
  // Global messages
  'required': 'The {{ field }} field is required',
  'email': 'Please provide a valid email address',
  'min': 'Must be at least {min} characters',
  'max': 'Must be at most {max} characters',

  // Field-specific messages
  'username.required': 'Please choose a username for your account',
  'username.min': 'Username must be at least {min} characters long',
  'username.max': 'Username cannot exceed {max} characters',
  'email.required': 'Email address is required to create your account',
  'password.required': 'A password is required for your account',
  'password.min': 'Password must be at least {min} characters for security',
}))

// Create a user validator using direct schema syntax
const userValidator = v.object({
  username: v.string().min(3).max(20).required(),
  email: v.string().email().required(),
  password: v.string().min(8).required(),
})

// Test validation with field-specific messages
const invalidUser = {
  username: 'ab', // Too short
  email: 'invalid-email',
  password: '123', // Too short
}

const result = userValidator.validate(invalidUser)

if (!result.valid) {
  console.error('Validation errors:')
  Object.entries(result.errors).forEach(([field, errors]) => {
    console.error(`${field}:`)
    errors.forEach((error: any) => {
      console.error(`  - ${error.message}`)
    })
  })
}
