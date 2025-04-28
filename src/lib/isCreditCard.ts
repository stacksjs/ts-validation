import isLuhnValid from './isLuhnNumber'
import assertString from './util/assertString'

const cards: Record<string, RegExp> = {
  amex: /^3[47]\d{13}$/,
  dinersclub: /^3(?:0[0-5]|[68]\d)\d{11}$/,
  discover: /^6(?:011|5\d\d)\d{12,15}$/,
  jcb: /^(?:2131|1800|35\d{3})\d{11}$/,
  mastercard: /^5[1-5]\d{2}|(222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/, // /^[25][1-7][0-9]{14}$/
  unionpay: /^(6[27]\d{14}|^(81\d{14,17}))$/,
  visa: /^4\d{12}(?:\d{3,6})?$/,
}

const allCards = (() => {
  const tmpCardsArray: RegExp[] = []
  for (const cardProvider in cards) {
    // istanbul ignore else
    if (Object.prototype.hasOwnProperty.call(cards, cardProvider)) {
      tmpCardsArray.push(cards[cardProvider])
    }
  }
  return tmpCardsArray
})()

interface CreditCardOptions {
  provider?: string
}

/**
 * Check if the string is CreditCard
 *
 * @param card - Options object
 * @param options = {} - Options object
 * @returns True if the string matches the validation, false otherwise
 */
export default function isCreditCard(card: string, options: CreditCardOptions = {}): boolean {
  assertString(card)
  const { provider } = options
  const sanitized = card.replace(/[- ]+/g, '')
  if (provider && provider.toLowerCase() in cards) {
    // specific provider in the list
    if (!(cards[provider.toLowerCase()].test(sanitized))) {
      return false
    }
  }
  else if (provider && !(provider.toLowerCase() in cards)) {
    /* specific provider not in the list */
    throw new Error(`${provider} is not a valid credit card provider.`)
  }
  else if (!allCards.some(cardProvider => cardProvider.test(sanitized))) {
    // no specific provider
    return false
  }
  return isLuhnValid(card)
}
