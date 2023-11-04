import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  /** 是否登录，程序用这个变量来判断是否登录 */
  const { bool: isLogin, setTrue: setLoginTrue, setFalse: setLoginFalse } = useBoolean(!!getToken())
  /** 用户信息 */
  const { data: userInfo, runAsync: updateUserInfo } = useRequest(ApiMemberDetail, {
    ready: isLogin,
    manual: false,
  })
  const visibility = useDocumentVisibility()
  const mqttConnectSuccessBus = useEventBus(MQTT_CONNECT_SUCCESS_BUS)
  const mqttDisconnectBus = useEventBus(MQTT_DISCONNECT_BUS)

  /** MQTT是否已连接 */
  const { bool: mqttIsConnected, setTrue: setMqttConnectedTrue, setFalse: setMqttConnectedFalse } = useBoolean(false)

  function setToken(token: string) {
    // 将token加密后存储到本地
    const _token = window.btoa(token)
    Local.set(STORAGE_TOKEN_KEY, _token)
    setLoginTrue()
  }

  function getToken() {
    const _token = Local.get<string | undefined>(STORAGE_TOKEN_KEY)?.value
    if (_token)
      return window.atob(_token)
    else
      return undefined
  }

  function removeToken() {
    Local.remove(STORAGE_TOKEN_KEY)
    setLoginFalse()
  }

  watch(visibility, (bool) => {
    // 如果页面可见，更新用户余额和用户信息
    if (bool === 'visible')
      updateUserInfo()
  })

  onMounted(() => {
    mqttConnectSuccessBus.on(() => setMqttConnectedTrue())
    mqttDisconnectBus.on(() => setMqttConnectedFalse())
  })

  return {
    isLogin,
    userInfo,
    mqttIsConnected,
    setToken,
    setLoginTrue,
    setLoginFalse,
    removeToken,
    getToken,
    updateUserInfo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
