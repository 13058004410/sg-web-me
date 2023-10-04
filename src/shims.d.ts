declare interface Window {
  // extend the window
}

declare module 'virtual:svg-icons-names' {
  const names: string[]
  export default names
}

// with vite-plugin-vue-markdown, markdown files can be treated as Vue components
declare module '*.md' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.tsx' {
  import { type DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}


/** 显示类型详细值 */
type Prettify<T> = {
  [P in keyof T]: T[P]
}

/**
 * 用于select的option
 */
interface ISelectOption {
  label: string
  value: string | number
}

interface IObject {
  [key: string]: any
}

/**
 * 聊天室用户角色
 */
type ChatUserRole = 'moderator'

/**
 * 用户级别
 */
type UserLevelBadge = 'bronze' | 'silver' | 'gold' | 'diamond' | '1' | '2' | '3' | '4'

/**
 * 聊天室用户
 */
interface ChatUserInfo {
  name: string
  id: string
  level?: UserLevelBadge
  role?: ChatUserRole
  [k: string]: any
}

/**
 * 聊天室消息体
 */
interface ChatMessageInfo {
  id: string
  type?: 'tip' | 'rain'
  sender: ChatUserInfo
  [k: string]: any
}