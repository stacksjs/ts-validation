import type { ValidationType } from '../src'
import { v } from '../src'

interface ValidationRule {
  rule: ValidationType
}

const _sample: ValidationRule = {
  rule: v.enum(['a', 'b', 'c']).required(),
}
