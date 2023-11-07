import { acceptHMRUpdate, defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  /** 是否登录，程序用这个变量来判断是否登录 */
  const { bool: isLogin, setTrue: setLoginTrue, setFalse: setLoginFalse } = useBoolean(!!getToken())
  /** 用户信息 */
  const { data: _userInfo, runAsync: updateUserInfo } = useRequest(ApiMemberDetail, {
    ready: isLogin,
    manual: false,
  })
  const { data: balanceData, runAsync: getBalanceData } = useRequest(ApiMemberBalance)
  const visibility = useDocumentVisibility()
  const mqttConnectSuccessBus = useEventBus(MQTT_CONNECT_SUCCESS_BUS)
  const mqttDisconnectBus = useEventBus(MQTT_DISCONNECT_BUS)

  /** MQTT是否已连接 */
  const { bool: mqttIsConnected, setTrue: setMqttConnectedTrue, setFalse: setMqttConnectedFalse } = useBoolean(false)

  const userInfo = computed(() => {
    if (balanceData.value && _userInfo.value)
      _userInfo.value.balance = balanceData.value

    return _userInfo.value
  })

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

  function removeUserInfo() {
    _userInfo.value = undefined
  }

  watch(visibility, (bool) => {
    // 如果页面可见，更新用户余额
    if (bool === 'visible')
      getBalanceData()
  })

  onMounted(() => {
    mqttConnectSuccessBus.on(() => {
      console.log('设置mqtt连接成功')
      setMqttConnectedTrue()
    })
    mqttDisconnectBus.on(() => {
      console.log('设置mqtt连接失败')
      setMqttConnectedFalse()
    })
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
    removeUserInfo,
    setMqttConnectedTrue,
    setMqttConnectedFalse,
    getBalanceData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
