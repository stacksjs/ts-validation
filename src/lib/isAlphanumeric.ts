import assertString from './util/assertString'

// Common alphanumeric patterns for different locales
export const alphanumeric: Record<string, RegExp> = {
  'en-US': /^[0-9A-Z]+$/i,
  'az-AZ': /^[0-9A-VXYZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[0-9\u0410-\u042F]+$/i, // Cyrillic characters А-Я
  'cs-CZ': /^[0-9A-Z\u00E1\u010D\u010F\u00E9\u011B\u00ED\u0148\u00F3\u0159\u0161\u0165\u00FA\u016F\u00FD\u017E]+$/i,
  'da-DK': /^[0-9A-Z\u00C6\u00D8\u00C5]+$/i,
  'de-DE': /^[0-9A-Z\u00C4\u00D6\u00DC\u00DF]+$/i,
  'el-GR': /^[0-9\u0391-\u03C9]+$/,
  'es-ES': /^[0-9A-Z\u00E1\u00E9\u00ED\u00F1\u00F3\u00FA\u00FC]+$/i,
  'fi-FI': /^[0-9A-Z\u00C5\u00C4\u00D6]+$/i,
  'fr-FR': /^[0-9A-Z\u00C0\u00C2\u00C6\u00C7\u00C9\u00C8\u00CA\u00CB\u00CF\u00CE\u00D4\u0152\u00D9\u00DB\u00DC\u0178]+$/i,
  'it-IT': /^[0-9A-Z\u00C0\u00C9\u00C8\u00CC\u00CD\u00CE\u00D2\u00D3\u00D9]+$/i,
  'hu-HU': /^[0-9A-Z\u00E1\u00E9\u00ED\u00F3\u00F6\u0151\u00FA\u00FC\u0171]+$/i,
  'nb-NO': /^[0-9A-Z\u00C6\u00D8\u00C5]+$/i,
  'nl-NL': /^[0-9A-Z\u00E1\u00E9\u00EB\u00EF\u00F3\u00F6\u00FC\u00FA]+$/i,
  'nn-NO': /^[0-9A-Z\u00C6\u00D8\u00C5]+$/i,
  'pl-PL': /^[0-9A-Z\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C]+$/i,
  'pt-PT': /^[0-9A-Z\u00E0\u00E1\u00E2\u00E3\u00E7\u00E9\u00EA\u00F3\u00F5\u00FA]+$/i,
  'ru-RU': /^[0-9\u0410-\u042F\u0430-\u044F\u0401\u0451]+$/,
  'sk-SK': /^[0-9A-Z\u00E1\u00E4\u010D\u010F\u00E9\u00ED\u013A\u013E\u0148\u00F3\u00F4\u0155\u0161\u0165\u00FA\u00FD\u017E]+$/i,
  'sr-RS@latin': /^[0-9A-Z\u010C\u0106\u0110\u0160\u017D]+$/i,
  'sr-RS': /^[0-9\u0410-\u042F\u0430-\u044F\u0402\u0452\u0408\u0458\u0409\u0459\u040A\u045A\u040B\u045B\u040F\u045F]+$/,
  'sv-SE': /^[0-9A-Z\u00C5\u00C4\u00D6]+$/i,
  'th-TH': /^[\u0E01-\u0E59]+$/,
  'tr-TR': /^[0-9A-Z\u00C7\u011E\u0130\u0131\u00D6\u015E\u00DC]+$/i,
  'uk-UA': /^[0-9\u0410-\u0429\u042C\u042E\u042F\u0490\u0404\u0406\u0407\u0430-\u0449\u044C\u044E\u044F\u0491\u0454\u0456\u0457]+$/,
  'ko-KR': /^[0-9\u3131-\u314E\u314F-\u3163\uAC00-\uD7A3]+$/,
  'ja-JP': /^[0-9\uFF10-\uFF19\u3041-\u3093\u30A1-\u30F6\uFF66-\uFF9F\u4E00-\u9FA0]+$/,
  'vi-VN': /^[0-9A-Z\u00C0\u00C1\u00C2\u00C3\u00C8\u00C9\u00CA\u00CC\u00CD\u00D2\u00D3\u00D4\u00D5\u00D9\u00DA\u00DD\u0102\u0110\u0128\u0168\u01A0\u01AF]+$/i,
  'fa-IR': /^[\u0627\u0628\u067E\u062A\u062B\u062C\u0686\u062D\u062E\u062F\u0630\u0631\u0632\u0698\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\u0641\u0642\u06A9\u06AF\u0644\u0645\u0646\u0648\u0647\u06CC\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8\u06F9\u06F0]+$/,
  'ar': /^[\u0030-\u0039\u0621-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0750-\u077F]+$/,
  'he': /^[0-9\u05D0-\u05EA]+$/,
  'hi-IN': /^[\u0900-\u0961\u0966-\u097F]+$/,
  // eslint-disable-next-line no-misleading-character-class
  'ur-PK': /^[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA840-\uA87F\uA880-\uA8DF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAB00-\uAB2F\uABC0-\uABFF\uAC00-\uD7AF\uD800-\uFA2F\uFA30-\uFA6F\uFA70-\uFADF\uFB00-\uFB4F\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+$/
} as const

type LocaleInstance = keyof typeof alphanumeric

export const locales = Object.keys(alphanumeric) as LocaleInstance[]

export interface AlphanumericOptions {
  ignore?: string | RegExp
  locale?: LocaleInstance
}

/**
 * Check if the string contains only alphanumeric characters (letters and numbers).
 *
 * @param str - The string to check
 * @param options - Optional parameters including locale and characters to ignore
 * @returns True if the string contains only alphanumeric characters, false otherwise
 */
export default function isAlphanumeric(str: string, options: AlphanumericOptions = {}): boolean {
  assertString(str)
  const { locale = 'en-US', ignore } = options

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '')
    }
    else {
      str = str.replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`, 'g'), '')
    }
  }

  if (locale in alphanumeric) {
    return alphanumeric[locale].test(str)
  }
  throw new Error(`Invalid locale '${locale}'`)
}
