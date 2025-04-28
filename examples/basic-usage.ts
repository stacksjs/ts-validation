import { v } from '../src'

// Example 1: Basic string validation
const username = 'john_doe'
const usernameValidator = v.string().min(3).max(20).alphanumeric()

if (usernameValidator.test(username)) {
  // eslint-disable-next-line no-console
  console.log('Username is valid!')
}
else {
  const errors = usernameValidator.validate(username).errors
  console.error('Username validation failed:', errors)
}

// Example 2: User form validation
interface User {
  name: string
  email: string
  age: number
  isActive: boolean
  tags: string[]
}

const userValidator = v.object<User>().shape({
  name: v.string().min(2).max(50).required(),
  email: v.string().email().required(),
  age: v.number().min(18).integer().required(),
  isActive: v.boolean().required(),
  tags: v.array<string>().each(v.string()).min(1).required(),
})

const validUser: User = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 25,
  isActive: true,
  tags: ['developer', 'typescript'],
}

const invalidUser = {
  name: 'J', // too short
  email: 'not-an-email',
  age: 17, // too young
  isActive: 'yes', // not a boolean
  tags: [], // empty array
}

const validResult = userValidator.validate(validUser)
// eslint-disable-next-line no-console
console.log('Valid user result:', validResult)

const invalidResult = userValidator.validate(invalidUser as any)
// eslint-disable-next-line no-console
console.log('Invalid user result:', invalidResult)

// Example 3: Nested object validation
const addressValidator = v.object().shape({
  street: v.string().required(),
  city: v.string().required(),
  zip: v.string().matches(/^\d{5}$/).required(),
})

const contactValidator = v.object().shape({
  name: v.string().required(),
  address: addressValidator,
  phones: v.array<string>().each(v.string().matches(/^\d{10}$/)).min(1),
})

const contact = {
  name: 'Jane Smith',
  address: {
    street: '123 Main St',
    city: 'New York',
    zip: '10001',
  },
  phones: ['1234567890', '0987654321'],
}

const contactResult = contactValidator.validate(contact)
// eslint-disable-next-line no-console
console.log('Contact validation result:', contactResult)

// Example 4: Custom validation
const isEven = (val: number) => val % 2 === 0
function isPrime(val: number) {
  if (val < 2)
    return false
  for (let i = 2; i <= Math.sqrt(val); i++) {
    if (val % i === 0)
      return false
  }
  return true
}

const evenValidator = v.custom(isEven, 'Number must be even')
const primeValidator = v.custom(isPrime, 'Number must be prime')

// eslint-disable-next-line no-console
console.log('Is 4 even?', evenValidator.test(4)) // true
// eslint-disable-next-line no-console
console.log('Is 7 prime?', primeValidator.test(7)) // true
// eslint-disable-next-line no-console
console.log('Is 8 prime?', primeValidator.test(8)) // false

// Example 5: Combining validators
const passwordValidator = v.string()
  .min(8) // at least 8 characters
  .matches(/[A-Z]/) // at least one uppercase letter
  .matches(/[a-z]/) // at least one lowercase letter
  .matches(/\d/) // at least one number
  .matches(/[^A-Z0-9]/i) // at least one special character

const password = 'Passw0rd!'
const passwordResult = passwordValidator.validate(password)
// eslint-disable-next-line no-console
console.log('Password validation result:', passwordResult)
