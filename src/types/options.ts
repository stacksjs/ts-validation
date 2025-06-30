export interface IsBase32Options {
  crockford?: boolean | string
}

export interface IsBase64Options {
  urlSafe?: boolean | string
  padding?: boolean | string
}

export interface IsByteLengthOptions {
  min?: number
  max?: number
}

export interface CreditCardOptions {
  provider?: string
}

export interface CurrencyOptions {
  symbol: string
  require_symbol: boolean
  allow_space_after_symbol: boolean
  symbol_after_digits: boolean
  allow_negatives: boolean
  parens_for_negatives: boolean
  negative_sign_before_digits: boolean
  negative_sign_after_digits: boolean
  allow_negative_sign_placeholder: boolean
  thousands_separator: string
  decimal_separator: string
  allow_decimal: boolean
  require_decimal: boolean
  digits_after_decimal: number[]
  allow_space_after_digits: boolean
}

export interface DecimalValidatorOptions {
  force_decimal: boolean
  decimal_digits: string
  locale: string
}

export interface IsIMEIOptions {
  allow_hyphens?: boolean | string
}

export interface IsInOptions {
  hasOwnProperty?: boolean | string
  indexOf?: boolean | string
  includes?: boolean | string
}

export interface IsIPOptions {
  version?: number
}

export interface IsISBNOptions {
  version?: string | number
}

export interface ISO8601Options {
  strictSeparator?: boolean
  strict?: boolean
}

export interface IsJSONOptions {
  allow_primitives?: boolean | string
}

export interface IsLatLongOptions {
  checkDMS?: boolean | string
}

export interface IsMACAddressOptions {
  eui?: boolean | string
  no_separators?: boolean
  no_colons?: boolean
}

export interface IsRgbColorOptions {
  allowSpaces?: boolean
  includePercentValues?: boolean
}

export interface IsTimeOptions {
  hourFormat: 'hour24' | 'hour12'
  mode: 'default' | 'withSeconds' | 'withOptionalSeconds'
}
