import { schema } from '../src'
import type { EnumValidatorType, Infer, IsRequired } from '../src'

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2) ? true : false
type Expect<T extends true> = T

const status = schema.enum(['draft', 'published', 'archived'])
type Status = Expect<Equal<Infer<typeof status>, 'draft' | 'published' | 'archived'>>

const tags = schema.array().each(schema.string())
type Tags = Expect<Equal<Infer<typeof tags>, string[]>>

const profile = schema.object({
  active: schema.boolean(),
  age: schema.number(),
  name: schema.string(),
  roles: schema.array().each(schema.enum(['admin', 'member'])),
})
type Profile = Expect<Equal<Infer<typeof profile>, {
  active: boolean
  age: number
  name: string
  roles: ('admin' | 'member')[]
}>>

/*
 * An enum validator has to satisfy the interface named after it.
 *
 * The declaration emitter widened `readonly name = 'enum' as const` to
 * `unknown`, so `schema.enum([...])` was not assignable to `EnumValidatorType`
 * and every consumer typed against that interface - a framework's env config,
 * say - rejected a value it happily validated at runtime. The failure was in
 * the published `.d.ts` only, which is why the test for it is a type test.
 */
const driver = schema.enum(['smtp', 'ses', 'log'])
const asInterface: EnumValidatorType<'smtp' | 'ses' | 'log'> = driver

type EnumName = Expect<Equal<typeof driver.name, 'enum'>>

void asInterface

// ── required(), at the type level ─────────────────────────────────────────
//
// `isRequired` is a runtime boolean and `required()` returned `this`, so
// nothing distinguished `string()` from `string().required()` in the type
// system. Anything building a shape out of a rule set - a request body, an
// event payload - therefore typed every field as present, including the ones
// that are not: the type saying something the runtime does not.
//
// The marker is a phantom property and the chainable methods return `this`, so
// it survives whatever comes after `.required()`. That is the part worth
// pinning: an earlier version put the marker on `required()` alone, and
// `.required().min(5)` handed back the plain validator and dropped it - so
// whether a field read as required depended on where in the chain it was
// written.

const optionalName = schema.string()
type OptionalName = Expect<Equal<IsRequired<typeof optionalName>, false>>

const requiredLast = schema.string().min(5).required()
type RequiredLast = Expect<Equal<IsRequired<typeof requiredLast>, true>>

const requiredFirst = schema.string().required().min(5).max(100)
type RequiredFirst = Expect<Equal<IsRequired<typeof requiredFirst>, true>>

const numberRequiredLast = schema.number().integer().positive().required()
type NumberRequiredLast = Expect<Equal<IsRequired<typeof numberRequiredLast>, true>>

const numberRequiredFirst = schema.number().required().integer().positive()
type NumberRequiredFirst = Expect<Equal<IsRequired<typeof numberRequiredFirst>, true>>

// `.optional()` does not add the marker, and does not remove what is not there.
const explicitlyOptional = schema.string().optional()
type ExplicitlyOptional = Expect<Equal<IsRequired<typeof explicitlyOptional>, false>>

// The marker must not disturb what the validator infers.
type StillString = Expect<Equal<Infer<typeof requiredFirst>, string>>
type StillNumber = Expect<Equal<Infer<typeof numberRequiredFirst>, number>>

export type RequiredChecks = [
  OptionalName,
  RequiredLast,
  RequiredFirst,
  NumberRequiredLast,
  NumberRequiredFirst,
  ExplicitlyOptional,
  StillString,
  StillNumber,
]
