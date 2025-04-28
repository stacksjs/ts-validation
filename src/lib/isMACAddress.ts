import assertString from './util/assertString'

export interface IsMACAddressOptions {
  eui?: boolean | string
}


const macAddress48 = /^[0-9a-f]{2}([-:\s])([0-9a-f]{2}\1){4}([0-9a-f]{2})$/i
const macAddress48NoSeparators = /^([0-9a-f]){12}$/i
const macAddress48WithDots = /^([0-9a-f]{4}\.){2}([0-9a-f]{4})$/i
const macAddress64 = /^[0-9a-f]{2}([-:\s])([0-9a-f]{2}\1){6}([0-9a-f]{2})$/i
const macAddress64NoSeparators = /^([0-9a-f]){16}$/i
const macAddress64WithDots = /^([0-9a-f]{4}\.){3}([0-9a-f]{4})$/i

export default function isMACAddress(str: string, options: IsMACAddressOptions: any) {
  assertString(str)
  if (options?.eui) {
    options.eui = String(options.eui)
  }
  /**
   * @deprecated `no_colons` TODO: remove it in the next major
   */
  if (options?.no_colons || options?.no_separators) {
    if (options.eui === '48') {
      return macAddress48NoSeparators.test(str)
    }
    if (options.eui === '64') {
      return macAddress64NoSeparators.test(str)
    }
    return macAddress48NoSeparators.test(str) || macAddress64NoSeparators.test(str)
  }
  if (options?.eui === '48') {
    return macAddress48.test(str) || macAddress48WithDots.test(str)
  }
  if (options?.eui === '64') {
    return macAddress64.test(str) || macAddress64WithDots.test(str)
  }
  return isMACAddress(str, { eui: '48' }) || isMACAddress(str, { eui: '64' })
}
