/**
 * Options for validators that accept locale parameters
 */
export interface ValidatorLocaleOptions {
  locale?: string | string[]
  options?: object
}

/**
 * Email validator options
 */
export interface EmailOptions {
  allow_display_name?: boolean
  require_display_name?: boolean
  allow_utf8_local_part?: boolean
  require_tld?: boolean
  ignore_max_length?: boolean
  allow_ip_domain?: boolean
  domain_specific_validation?: boolean
  blacklisted_chars?: string
  host_blacklist?: string[]
  host_whitelist?: string[]
}

/**
 * URL validator options
 */
export interface URLOptions {
  protocols?: string[]
  require_tld?: boolean
  require_protocol?: boolean
  require_host?: boolean
  require_port?: boolean
  require_valid_protocol?: boolean
  allow_underscores?: boolean
  host_whitelist?: (string | RegExp)[]
  host_blacklist?: (string | RegExp)[]
  allow_trailing_dot?: boolean
  allow_protocol_relative_urls?: boolean
  allow_fragments?: boolean
  allow_query_components?: boolean
  validate_length?: boolean
  disallow_auth?: boolean
}

/**
 * IP address validator options
 */
export interface IPOptions {
  version?: string
}

/**
 * MAC address validator options
 */
export interface MACAddressOptions {
  no_colons?: boolean
  case_sensitive?: boolean
}

/**
 * FQDN validator options
 */
export interface FQDNOptions {
  require_tld?: boolean
  allow_underscores?: boolean
  allow_trailing_dot?: boolean
  allow_numeric_tld?: boolean
  allow_wildcard?: boolean
}

/**
 * Alpha validator options
 */
export type AlphaOptions = {
  ignore?: string | RegExp
} & ValidatorLocaleOptions

/**
 * Alphanumeric validator options
 */
export type AlphanumericOptions = {
  ignore?: string | RegExp
} & ValidatorLocaleOptions

/**
 * Numeric validator options
 */
export interface NumericOptions {
  no_symbols?: boolean
  locale?: string
}

/**
 * Float validator options
 */
export interface FloatOptions {
  min?: number
  max?: number
  gt?: number
  lt?: number
  locale?: string
}

/**
 * Integer validator options
 */
export interface IntOptions {
  min?: number
  max?: number
  allow_leading_zeroes?: boolean
  lt?: number
  gt?: number
}

/**
 * RGB color validator options
 */
export interface RGBOptions {
  includePercentValues?: boolean
}

/**
 * HSL color validator options
 */
export interface HSLOptions {
  legacy?: boolean
  includePercentValues?: boolean
}

/**
 * Length validator options
 */
export interface LengthOptions {
  min?: number
  max?: number
}

/**
 * Credit card validator options
 */
export interface CreditCardOptions {
  provider?: string | string[]
}

/**
 * Currency validator options
 */
export interface CurrencyOptions {
  symbol?: string
  require_symbol?: boolean
  allow_space_after_symbol?: boolean
  symbol_after_digits?: boolean
  allow_negatives?: boolean
  parens_for_negatives?: boolean
  negative_sign_before_digits?: boolean
  negative_sign_after_digits?: boolean
  allow_negative_sign_placeholder?: boolean
  thousands_separator?: string
  decimal_separator?: string
  allow_decimal?: boolean
  require_decimal?: boolean
  digits_after_decimal?: number[]
  allow_space_after_digits?: boolean
}

/**
 * Base64 validator options
 */
export interface Base64Options {
  urlSafe?: boolean
}

/**
 * ISO8601 validator options
 */
export interface ISO8601Options {
  strict?: boolean
  strictSeparator?: boolean
}

/**
 * Postal code validator options
 */
export interface PostalCodeOptions {
  locale?: string
}

/**
 * Mobile phone validator options
 */
export type MobilePhoneOptions = {
  strictMode?: boolean
} & ValidatorLocaleOptions

/**
 * Strong password validator options
 */
export interface StrongPasswordOptions {
  minLength?: number
  minLowercase?: number
  minUppercase?: number
  minNumbers?: number
  minSymbols?: number
  returnScore?: boolean
  pointsPerUnique?: number
  pointsPerRepeat?: number
  pointsForContainingLower?: number
  pointsForContainingUpper?: number
  pointsForContainingNumber?: number
  pointsForContainingSymbol?: number
}

export interface IsAfterOptions {
  comparisonDate?: string | number | Date
}

export interface IsAlphaOptions {
  ignore?: string | RegExp
}
