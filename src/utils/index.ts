import type { EnumCurrencyKey } from '~/apis/types'
import { i18n } from '~/modules/i18n'

const { t } = i18n.global

const { VITE_I18N_DEFAULT_LANG } = getEnv()

interface IFormatNumberOptions {
  groupSize?: number
  separator?: string
}

class Application {
  /** 数字货币默认保留小数长度 */
  #CURRENCY_DEFAULT_DECIMAL = 8

  constructor() {
    console.log('Appliction constructor')
  }

  /**
   * @description 时间戳转换成指定国家的时间
   * @param {number} timestamp 时间戳
   * @param {EnumLanguage} language 语言
   * @returns {string} 格式化后的时间
   */
  timestampToTime(
    timestamp: number,
    language = EnumLanguage[VITE_I18N_DEFAULT_LANG],
  ): string {
    const languageStr = EnumLanguage[language]

    if (timestamp.toString().length !== 13)
      timestamp = timestamp * 1000

    return new Intl.DateTimeFormat(
      languageStr,
      { dateStyle: 'short', timeStyle: 'medium' },
    ).format(timestamp)
  }

  /**
   * @description 将数字转换为货币
   * @param {number} number 数字
   * @param {typeof EnumCurrency} language 语言
   * @returns {string} 格式化后的货币
   */
  numberToCurrency(number: number, language = EnumCurrency.BTC): string {
    // 法定货币列表
    const fiatCurrencyList = [
      EnumCurrency.BRL,
      EnumCurrency.INR,
    ]

    if (fiatCurrencyList.includes(language)) {
      return new Intl.NumberFormat(
        EnumCurrency[language],
        {
          style: 'currency',
          currency: EnumCurrency[language],
        },
      ).format(Number(toFixed(number, 2)))
    }

    else { return toFixed(number, this.#CURRENCY_DEFAULT_DECIMAL) }
  }

  copy(str: string) {
    /** legacy 兼容http复制 */
    const { copy: _copy, copied } = useClipboard({ legacy: true })
    _copy(str).then(() => {
      if (copied.value)
        toast(t('copied'))
    })
  }

  getDeviceNumber() {
    return 'testwebwebwebwebewb'
  }

  /**
   * 将Object转换成url参数
   * @param {Record<string, any>} obj
   * @returns {string}
   */
  objectToUrlParams(obj: Record<string, any>) {
    if (Object.keys(obj).length === 0)
      return ''

    const filterObj = Object.entries(obj).filter(([, value]) => {
      if (
        typeof value === 'object'
        || Array.isArray(value)
        || value === void 0
        || value === null
        || value === ''
      )
        return false
      return true
    })

    const params = new URLSearchParams(filterObj)
    return params.toString()
  }

  /**
   * 将url参数转换成Object
   * @param {string} url
   * @returns {Record<string, any>}
   */
  urlParamsToObject(url: string) {
    const params = new URLSearchParams(url)
    const obj = Object.fromEntries(params)
    return obj
  }

  /**
   * 异步函数，Promise.allSettled
   * @param {Promise<any>[]} promises
   * @returns {Promise<any[]>}
   */
  async allSettled(promises: Promise<any>[]) {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     Promise.allSettled(promises).then((result) => {
    //       resolve(result)
    //     })
    //   }, 300)
    // })
    const result = await Promise.allSettled(promises)
    return result
  }

  /**
   * 通过指定的分隔符分割字符串
   * @param {string} numberStr 数字
   * @param {IFormatNumberOptions} options 选项
   * @returns {string}
   */
  formatNumber(numberStr: string, options: IFormatNumberOptions = {}) {
    const _options = Object.assign({
      groupSize: 3,
      separator: ',',
    }, options)

    const { groupSize, separator } = _options
    // 分割整数和小数部分
    const parts = numberStr.split('.')
    let integerPart = parts[0]
    const decimalPart = parts[1] || ''

    // 添加分隔符到整数部分
    if (groupSize > 0 && separator.length > 0) {
      const regex = new RegExp(`\\B(?=(\\d{${groupSize}})+(?!\\d))`, 'g')
      integerPart = integerPart.replace(regex, separator)
    }

    // 拼接整数和小数部分
    if (decimalPart.length > 0)
      return `${integerPart}.${decimalPart}`

    else
      return integerPart
  }

  /**
   * 判断是不是虚拟货币
   * @param {EnumCurrencyKey} currency
   */
  isVirtualCurrency(currency: EnumCurrencyKey) {
    const virtualList: EnumCurrencyKey[] = [
      'USDT',
      'BTC',
      'ETH',
      'BNB',
    ]
    return virtualList.includes(currency)
  }

  /**
 * 获取货币后缀长度
 * @param {EnumCurrencyKey} currency 货币类型
 * @returns {number} 后缀长度
 */
  getCurrencySuffixLength(currency: EnumCurrencyKey) {
    if (this.isVirtualCurrency(currency))
      return 8
    else
      return 2
  }

  /**
   * 根据长度截取字符串，或者在后面补0
   * @param {number} val 数字
   * @param {number} suffixLength 小数点后需要的长度
   *
   * @example sliceOrPad(0.2, 2) => 0.20
   * @example sliceOrPad(0.28, 8) => 0.28000000
   */
  sliceOrPad(val: number, suffixLength: number) {
    // 转换为字符串，以便处理小数点后的部分
    const valStr = val.toString()

    // 检查是否有小数点
    if (valStr.includes('.')) {
      const [integerPart, decimalPart] = valStr.split('.')

      // 如果小数点后的长度小于指定的长度，则在后面补0
      if (decimalPart.length < suffixLength) {
        const paddedDecimalPart = decimalPart.padEnd(suffixLength, '0')
        return `${integerPart}.${paddedDecimalPart}`
      }
      else {
        // 否则，截取小数点后指定长度的部分
        const slicedDecimalPart = decimalPart.slice(0, suffixLength)
        return `${integerPart}.${slicedDecimalPart}`
      }
    }
    else {
      // 如果没有小数点，则在后面补足指定长度的小数部分
      const paddedDecimalPart = '0'.repeat(suffixLength)
      return `${valStr}.${paddedDecimalPart}`
    }
  }
}

export const application = new Application()

/**
 * @description 获取环境变量
 * @returns {ImportMetaEnv}
 */
export function getEnv() {
  return import.meta.env
}

/**
 * 滚动内容区域到顶部
 */
export function scrollMainContentToTop() {
  const dom = document.getElementById('main-content-scrollable')
  dom && dom.scrollTo({ top: 0 })
}
