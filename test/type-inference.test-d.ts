import { schema } from '../src'
import type { EnumValidatorType, Infer } from '../src'

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
