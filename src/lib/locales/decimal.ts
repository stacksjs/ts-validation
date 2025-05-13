/**
 * Decimal separator by locale
 */
export const decimal: Record<string, string> = {
  'en-US': '.',
  'ar': '٫',
}

// Source: https://en.wikipedia.org/wiki/Decimal_mark
export const dotDecimal: string[] = ['ar-EG', 'ar-LB', 'ar-LY']
export const commaDecimal: string[] = [
  'bg-BG',
  'cs-CZ',
  'da-DK',
  'de-DE',
  'el-GR',
  'en-ZM',
  'eo',
  'es-ES',
  'fr-CA',
  'fr-FR',
  'id-ID',
  'it-IT',
  'ku-IQ',
  'hi-IN',
  'hu-HU',
  'nb-NO',
  'nn-NO',
  'nl-NL',
  'pl-PL',
  'pt-PT',
  'ru-RU',
  'kk-KZ',
  'si-LK',
  'sl-SI',
  'sr-RS@latin',
  'sr-RS',
  'sv-SE',
  'tr-TR',
  'uk-UA',
  'vi-VN',
]

// Initialize the decimal separators
for (let i = 0; i < dotDecimal.length; i++) {
  decimal[dotDecimal[i]] = decimal['en-US']
}

for (let i = 0; i < commaDecimal.length; i++) {
  decimal[commaDecimal[i]] = ','
}

// Add English locales
const englishLocales = ['AU', 'GB', 'HK', 'IN', 'NZ', 'ZA', 'ZM']
for (let i = 0; i < englishLocales.length; i++) {
  const locale = `en-${englishLocales[i]}`
  decimal[locale] = decimal['en-US']
}

// Add Arabic locales
const arabicLocales = ['AE', 'BH', 'DZ', 'EG', 'IQ', 'JO', 'KW', 'LB', 'LY', 'MA', 'QM', 'QA', 'SA', 'SD', 'SY', 'TN', 'YE']
for (let i = 0; i < arabicLocales.length; i++) {
  const locale = `ar-${arabicLocales[i]}`
  decimal[locale] = decimal.ar
}

// Add other locale mappings
decimal['fr-CA'] = decimal['fr-FR']
decimal['pt-BR'] = decimal['pt-PT']
decimal['pl-Pl'] = decimal['pl-PL']
