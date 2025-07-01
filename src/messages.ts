export interface MessageProviderType {
  getMessage: (ruleName: string, customMessage?: string, field?: string, params?: Record<string, any>) => string
  setMessage: (ruleName: string, message: string, field?: string) => void
  setMessages: (messages: Record<string, string>) => void
}

export class MessageProvider implements MessageProviderType {
  private messages: Map<string, string> = new Map()

  constructor(messages?: Record<string, string>) {
    if (messages) {
      this.setMessages(messages)
    }
  }

  getMessage(ruleName: string, ruleMessage?: string, field?: string, params?: Record<string, any>): string {
    let message: string | undefined

    // First try field-specific message
    if (field) {
      const fieldSpecificKey = `${field}.${ruleName}`
      message = this.messages.get(fieldSpecificKey)
    }

    // Fall back to general rule message
    if (!message) {
      message = this.messages.get(ruleName)
    }

    // Fall back to rule-specific message (from addRule)
    if (!message && ruleMessage) {
      message = ruleMessage
    }

    // Replace parameters in the message
    if (message && params) {
      message = this.replaceParams(message, params)
    }

    // Fall back to default message
    if (!message) {
      message = this.getDefaultMessage(ruleName)
    }

    return message
  }

  setMessage(rule: string, message: string, field?: string): void {
    const key = field ? `${field}.${rule}` : rule
    this.messages.set(key, message)
  }

  setMessages(messages: Record<string, string>): void {
    Object.entries(messages).forEach(([key, message]) => {
      this.messages.set(key, message)
    })
  }

  private getDefaultMessage(rule: string): string {
    const defaults: Record<string, string> = {
      required: 'This field is required',
      string: 'Must be a string',
      number: 'Must be a number',
      integer: 'Must be an integer',
      float: 'Must be a float',
      boolean: 'Must be a boolean',
      array: 'Must be an array',
      object: 'Must be an object',
      email: 'Must be a valid email address',
      url: 'Must be a valid URL',
      min: 'Must be at least {min}',
      max: 'Must be at most {max}',
      length: 'Must be exactly {length}',
      matches: 'Must match pattern {pattern}',
      equals: 'Must be equal to {value}',
      alphanumeric: 'Must only contain letters and numbers',
      alpha: 'Must only contain letters',
      numeric: 'Must only contain numbers',
      positive: 'Must be positive',
      negative: 'Must be negative',
      date: 'Must be a valid date',
      datetime: 'Must be a valid datetime',
      time: 'Must be a valid time',
      timestamp: 'Must be a valid timestamp',
      unix: 'Must be a valid Unix timestamp',
      json: 'Must be valid JSON',
      enum: 'Must be one of: {values}',
      custom: 'Validation failed',
    }

    return defaults[rule] || 'Validation failed'
  }

  private replaceParams(message: string, params: Record<string, any>): string {
    return message.replace(/\{([^}]+)\}/g, (_, key) => {
      const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], params)
      return value !== undefined ? String(value) : `{${key}}`
    })
  }
}

// Global messages provider instance
let _globalMessagesProvider: MessageProviderType = new MessageProvider()

// Function to set the global messages provider
export function setCustomMessages(provider: MessageProvider): void {
  _globalMessagesProvider = provider
}

// Function to get the current messages provider
export function getCustomMessages(): MessageProviderType {
  return _globalMessagesProvider
}
