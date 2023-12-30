// const vipIconMap = ['', 'chat-star-1']

export function useVipInfo() {
  const appStore = useAppStore()

  const { userInfo, vipConfigData } = storeToRefs(appStore)

  const vip = computed(() => userInfo.value?.vip ?? '0')
  const score = computed(() => userInfo.value && +userInfo.value >= 0 ? +userInfo.value : 0)

  const vipConfigArray = computed(() => vipConfigData.value ? Object.values(vipConfigData.value).sort((a, b) => +a.level - +b.level) : [])
  const min = computed(() => vipConfigArray.value[0]?.level ?? '0')
  const max = computed(() => vipConfigArray.value.toReversed()[0]?.level ?? '0')
  const prevLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value[`v${+vip.value - 1}`]
  })
  const currentLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value[`v${vip.value}`]
  })
  const nextLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value[`v${+vip.value + 1}`]
  })
  const isMinLevel = computed(() => !(+vip.value > 0))
  const isMaxLevel = computed(() => nextLevel.value === undefined)
  const progress = computed(() => {
    if (nextLevel.value)
      return floor(score.value / +nextLevel.value.score, 1)
    return 100
  })
  const scoreToNext = computed(() => {
    if (nextLevel.value)
      return +(currentLevel.value?.score ?? 0) - score.value
    else
      return 0
  })

  return {
    vip,
    score,
    scoreToNext,
    prevLevel,
    currentLevel,
    nextLevel,
    isMinLevel,
    isMaxLevel,
    progress,
    min,
    max,
    vipConfigArray,
  }
}
