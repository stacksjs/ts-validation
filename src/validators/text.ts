import type { TextValidatorType, ValidationNames } from '../types'
import { StringValidator } from './strings'

export class TextValidator extends StringValidator implements TextValidatorType {
  public name: ValidationNames = 'text'

  constructor() {
    super()
    this.addRule({
      name: 'text',
      test: (value: string | null | undefined): value is string => typeof value === 'string',
      message: 'Must be a text',
    })
  }
}

export function text(): TextValidator {
  return new TextValidator()
}
