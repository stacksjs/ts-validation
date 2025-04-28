import type { AlphaOptions } from './types'
import assertString from './util/assertString'

// Common patterns for different locales
export const alpha: Record<string, RegExp> = {
  'en-US': /^[A-Z]+$/i,
  'az-AZ': /^[A-ZÇƏĞİıÖŞÜ]+$/i,
  'bg-BG': /^[А-Яа-я]+$/,
  'cs-CZ': /^[A-Záčďéěíňóřšťúůýž]+$/i,
  'da-DK': /^[A-ZÆØÅ]+$/i,
  'de-DE': /^[A-ZÄÖÜß]+$/i,
  'el-GR': /^[Α-ώ]+$/,
  'es-ES': /^[A-Záéíñóúü]+$/i,
  'fa-IR': /^[ابپتثجچحخدذرزژسشصضطظعغفقکگلمنوهی]+$/,
  'fi-FI': /^[A-ZÅÄÖ]+$/i,
  'fr-FR': /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  'it-IT': /^[A-ZÀÉÈÌÍÎÒÓÙ]+$/i,
  'ja-JP': /^[ぁ-んァ-ヶｦ-ﾟ一-龠ー・。、]+$/,
  'nb-NO': /^[A-ZÆØÅ]+$/i,
  'nl-NL': /^[A-Záéëïóöüú]+$/i,
  'nn-NO': /^[A-ZÆØÅ]+$/i,
  'hu-HU': /^[A-Záéíóöőúüű]+$/i,
  'pl-PL': /^[A-Ząćęłńóśźż]+$/i,
  'pt-PT': /^[A-Za-záàâãäçéêëíïóôõöúüÀÂÃÄÇÉÊËÍÏÓÔÕÖÚÜ]+$/,
  'ru-RU': /^[А-Яа-яЁё]+$/,
  'sk-SK': /^[A-Záäčďéíĺľňóôŕšťúýž]+$/i,
  'sr-RS@latin': /^[A-ZČĆĐŠŽ]+$/i,
  'sr-RS': /^[А-Яа-яЂђЈјЉљЊњЋћЏџ]+$/,
  'sv-SE': /^[A-ZÅÄÖ]+$/i,
  'th-TH': /^[ก-๐]+$/,
  'tr-TR': /^[A-ZÇĞİıÖŞÜ]+$/i,
  'uk-UA': /^[А-ЩЬЮЯҐЄІЇа-щьюяґєії]+$/,
  'vi-VN': /^[A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯ]+$/i,
  'ko-KR': /^[ㄱ-ㅎㅏ-ㅣ가-힣]+$/,
  'ku-IQ': /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثذصضظ]+$/,
  'ar': /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/,
  'he': /^[א-ת]+$/,
  'hi-IN': /^[\u0900-\u0961]+[\u0972-\u097F]*$/,
  'ur-PK': /^[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u31A0-\u31BF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA840-\uA87F\uA880-\uA8DF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAB00-\uAB2F\uABC0-\uABFF\uAC00-\uD7AF\uD800-\uFA2F\uFA30-\uFA6F\uFA70-\uFADF\uFB00-\uFB4F\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+$/
} as const

export type LocaleInstance = keyof typeof alpha
export const locales: readonly LocaleInstance[] = Object.keys(alpha) as LocaleInstance[]

/**
 * Check if the string contains only alpha characters (letters).
 *
 * @param str - The string to check
 * @param options - Optional parameters including locale and characters to ignore
 * @returns True if the string contains only alpha characters
 */
export default function isAlpha(str: string, options: AlphaOptions = {}): boolean {
  assertString(str)
  const { locale = 'en-US', ignore } = options

  if (ignore) {
    if (ignore instanceof RegExp) {
      str = str.replace(ignore, '')
    }
    else {
      str = str.replace(new RegExp(`[${ignore.replace(/[-[\]{}()*+?.,\\^$|#s]/g, '\\$&')}]`, 'g'), '')
    }
  }

  if (locale in alpha) {
    return alpha[locale as LocaleInstance].test(str)
  }
  throw new Error(`Invalid locale '${locale}'`)
}
