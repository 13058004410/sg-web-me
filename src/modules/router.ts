import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import type { App } from 'vue'
import { getLocalUrlToUrlLang, isExistRouterLanguage } from './i18n'
import generatedRoutes from '~pages'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
    /** 是否需要登录 */
    auth?: boolean
    /** 浏览器标题 */
    browserTitle?: string
    /** layout with-menu 标题 */
    withMenuTitle?: string
    /** layout with-menu 图标 */
    withMenuIcon?: string
    /** layout with-menu 菜单数据 */
    withMenuMenu?: Array<{ title: string; path: string; token?: boolean; isT?: boolean }>
    /** layout with-menu 移动端菜单展示方式 */
    withMenuMobileType?: 'tabs' | 'select'
    /** 布局配置 */
    withMenuLayoutConf?: { padding?: string; borderRadius?: string }
  }
}

const routes = setupLayouts(generatedRoutes)

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash.length)
      return
    scrollToTop()
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const defaultLang = getLocalUrlToUrlLang()
  const baseUrl = `/${defaultLang}`

  // 如果没有语言参数，跳转到默认语言
  if (to.params.lang === void 0) {
    next(baseUrl)
    return
  }

  // 如果语言参数不是项目中的语言，跳转到默认语言
  if (
    to.params.lang
    && (typeof to.params.lang === 'string')
    && !isExistRouterLanguage(to.params.lang)
  ) {
    next(baseUrl)
    return
  }
  else {
    const path = to.path.replace(/\/$/, '')
    if (path === `/${to.params.lang}`) {
      next(`${path}/casino`)
      return
    }
  }

  if (
    isExistRouterLanguage(to.params.lang as string)
    && isExistRouterLanguage(from.params.lang as string)
  ) {
    if (to.params.lang !== from.params.lang) {
      setTimeout(() => {
        location.reload()
      }, 30)
    }
  }

  const appStore = useAppStore()
  const { isLogin } = storeToRefs(appStore)
  const { openRegisterDialog } = useRegisterDialog()
  const auth = to.meta.auth || false

  if (auth) {
    if (!isLogin.value) {
      openRegisterDialog()
      next(baseUrl)
      return
    }
  }

  next()
})

export function install(app: App<Element>) {
  app.use(router)
}
