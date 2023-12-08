import { acceptHMRUpdate, defineStore } from 'pinia'
import { getInitLangIndex, loadLanguageAsync } from '~/modules/i18n'
import { EnumLanguage } from '~/utils/enums'

export const useLanguageStore = defineStore('language', () => {
  /** 所有语言列表 */
  const AllLanguages = ref<Array<{
    title: string
    path: string
    icon: string
    value: EnumLanguage
    phone: string
    phoneId: string
  }>>([
    {
      title: '中文',
      path: '',
      icon: '',
      value: EnumLanguage['zh-CN'],
      phone: '+86',
      phoneId: '1137',
    },
    {
      title: 'English',
      path: '',
      icon: '',
      value: EnumLanguage['en-US'],
      phone: '+1',
      phoneId: '1283',
    },
    {
      title: 'Tiếng Việt',
      path: '',
      icon: '',
      value: EnumLanguage['vi-VN'],
      phone: '+84',
      phoneId: '1287',
    },
    {
      title: 'Português',
      path: '',
      icon: '',
      value: EnumLanguage['pt-BR'],
      phone: '+55',
      phoneId: '1125',
    },
  ])

  /** 当前选择的语言 */
  const userLanguage = ref(getInitLangIndex())

  /** 更换语言 */
  async function changeLanguage(langIndex: EnumLanguage) {
    Local.set(STORAGE_LANGUAGE_KEY, langIndex)
    userLanguage.value = langIndex
    await loadLanguageAsync(langIndex)
    setTimeout(() => {
      location.reload()
    }, 100)
  }

  return {
    AllLanguages,
    userLanguage,
    changeLanguage,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLanguageStore, import.meta.hot))
