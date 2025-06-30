import type { alphanumeric } from '../lib/isAlphanumeric'
import type isEmail from '../lib/isEmail'
import type isURL from '../lib/isURL'
import type { StringValidator } from '../validators/strings'
import type { LengthValidator, Validator } from './base'

export interface ContainsOptions {
  ignoreCase?: boolean
  minOccurrences?: number
}

export interface AlphanumericOptions {
  ignore?: string | RegExp
  locale?: LocaleInstance
}

export type LocaleInstance = keyof typeof alphanumeric

export interface IsEmptyOptions {
  /**
   * Consider spaces as empty
   */
  ignoreWhitespace?: boolean
}

export interface IsFQDNOptions {
  allow_trailing_dot?: boolean | string
  allow_wildcard?: boolean | string
  require_tld?: boolean | string
  allow_numeric_tld?: boolean | string
  ignore_max_length?: number
  allow_underscores?: boolean | string
}

export interface IsLengthOptions {
  min?: number
  max?: number
  discreteLengths?: boolean | string
}

export interface IsURLOptions {
  protocols?: string[]
  require_tld?: boolean
  require_protocol?: boolean
  require_host?: boolean
  require_port?: boolean
  require_valid_protocol?: boolean
  allow_underscores?: boolean
  allow_trailing_dot?: boolean
  allow_protocol_relative_urls?: boolean
  allow_fragments?: boolean
  allow_query_components?: boolean
  validate_length?: boolean
  max_allowed_length?: number
  host_whitelist?: (string | RegExp)[]
  host_blacklist?: (string | RegExp)[]
  disallow_auth?: boolean
}

export interface NormalizeEmailOptions {
  gmail_remove_subaddress?: boolean | string
  gmail_remove_dots?: boolean | string
  all_lowercase?: boolean | string
  gmail_lowercase?: boolean | string
  gmail_convert_googlemaildotcom?: boolean | string
  icloud_remove_subaddress?: boolean | string
  icloud_lowercase?: boolean | string
  outlookdotcom_remove_subaddress?: boolean | string
  outlookdotcom_lowercase?: boolean | string
  yahoo_remove_subaddress?: boolean | string
  yahoo_lowercase?: boolean | string
  yandex_lowercase?: boolean | string
  yandex_convert_yandexru?: boolean | string
}

export interface StringValidatorType extends Validator<string>, LengthValidator<StringValidator> {
  email: (options?: Parameters<typeof isEmail>[1]) => StringValidator
  url: (options?: Parameters<typeof isURL>[1]) => StringValidator
  matches: (pattern: RegExp) => StringValidator
  equals: (param: string) => StringValidator
  alphanumeric: () => StringValidator
  alpha: () => StringValidator
  numeric: () => StringValidator
  custom: (fn: (value: string) => boolean, message: string) => StringValidator
}

export interface TextValidatorType extends StringValidatorType {}
