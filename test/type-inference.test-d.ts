import { schema } from '../src'
import type { Infer } from '../src'

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
