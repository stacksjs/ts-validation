// These are helper classes for runtime type checking in env handling
export class ValidationBoolean {
  constructor(public value?: boolean) {}
}

export class ValidationNumber {
  constructor(public value?: number) {}
}

export class ValidationEnum {
  constructor(public values: readonly string[], public value?: string) {}
}
