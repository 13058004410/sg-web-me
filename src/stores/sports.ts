import type { Menu } from '~/composables/useApiMenuData'
import { i18n } from '~/modules/i18n'

const { t } = i18n.global

export enum EnumSportsPanelType {
  /** 三项投注 */
  THREE = 'THREE',
  /** 标准 */
  STANDARD = 'STANDARD',
}

export enum EnumSportsOddsType {
  /** 小数式 */
  DECIMAL = 'DECIMAL',
  /** 分数式 */
  FRACTION = 'FRACTION',
  /** 美式 */
  AMERICAN = 'AMERICAN',
  /** 印尼格式 */
  INDONESIA = 'INDONESIA',
  /** 马来格式 */
  MALAYSIA = 'MALAYSIA',
  /** 香港格式 */
  HONGKONG = 'HONGKONG',
}

/** 投注单数据格式 */
interface IBetSlipData {
  // 测试
  [key: string]: any
}

export const useSportsStore = defineStore('sports', () => {
  const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
  /** 体育赔率展示方式 */
  const sportsOddsType = ref(getSportsOddsType())
  /** 投注单数据 */
  const betSlipData = ref<IBetSlipData[]>([])
  /** 当前场馆ID */
  const currentProvider = ref(Local.get<string>(STORAGE_SPORTS_CURRENT_PROVIDER)?.value ?? '')
  /** 当前滚球选中的体育项目 */
  const currentLiveNav = ref(-1)
  /** 当前即将开赛选中的体育项目 */
  const currentUpcomingNav = ref(0)
  /** 购物车 */
  const cart = reactive(new SportsCart(currentGlobalCurrency.value))

  /** 体育计数源 */
  const { data: allSportsCount, run: runSportsCount } = useRequest(() =>
    ApiSportCount({ ic: 0 }),
  {
    onSuccess(res) {
      if (currentLiveNav.value === -1)
        currentLiveNav.value = res.list.find(a => a.lc > 0)?.si ?? 0
    },
  })

  /** 赛事收藏数据源 */
  const {
    data: sportsFavoriteData,
    run: runGetFavoriteList,
  } = useRequest(ApiSportGetFavoriteList, { throttleInterval: 1500 })

  /** 侧边栏数据源 */
  const { data: sidebarData, run: runSportsSidebar } = useRequest(ApiSportSidebar, {
    refreshDeps: isLogin,
    refreshDepsAction: () => {
      if (sidebarData.value && sidebarData.value.all && isLogin.value) {
        const allSportsSi = sidebarData.value.all.map(a => a.si)
        runGetFavoriteList({
          sis: allSportsSi,
          cur: currencyConfig[currentGlobalCurrency.value].cur,
        })
      }
    },
    onSuccess(res) {
      if (isLogin.value) {
        const allSportsSi = res.all.map(a => a.si)
        runGetFavoriteList({
          sis: allSportsSi,
          cur: currencyConfig[currentGlobalCurrency.value].cur,
        })
      }
    },
  })

  /** 获取场馆列表 */
  const {
    run: runSportsProvider,
    data: sportsProviderData,
  } = useList(ApiMemberPlatformList, {
    onSuccess(res) {
      if (res.d && !Local.get<string>(STORAGE_SPORTS_CURRENT_PROVIDER)) {
        currentProvider.value = res.d[0].id
        Local.set(STORAGE_SPORTS_CURRENT_PROVIDER, res.d[0].id)
      }
      runSportsCount()
      runSportsSidebar()
    },
  })
  runSportsProvider({ game_type: 4 })

  const AllOddsTypes = computed<Array<{
    title: string
    path: string
    icon: string
    value: EnumSportsOddsType
  }>>(() => Object.values(EnumSportsOddsType).map(m => ({ title: t(m), path: '', icon: '', value: m })))

  /** 场馆列表 */
  const providerList = computed(() => {
    return sportsProviderData.value && sportsProviderData.value.d
      ? sportsProviderData.value.d
      : []
  })

  /** 滚球计数 */
  const liveCount = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.reduce((acc, cur) => {
        return acc + cur.lc
      }, 0)
    }
    return 0
  })

  /** 侧边栏菜单 */
  const sportsMenu = computed(() => {
    return [
      {
        title: t('sports_tab_live_events'),
        path: `/sports/${SPORTS_PLAT_ID}/live`,
        icon: 'spt-ball-plate',
        list: [],
        domId: '',
        fixtureCount: liveCount.value,
      },
      // eslint-disable-next-line max-len
      { title: t('sports_tab_starting_soon'), path: `/sports/${SPORTS_PLAT_ID}/upcoming`, icon: 'spt-timing', list: [], domId: '' },
      {
        title: t('my_bets'),
        path: `/sports/${SPORTS_PLAT_ID}/my-bets?type=sports`,
        icon: 'spt-user-bet',
        list: [],
        domId: '',
        token: true,
      },
    ]
  })

  /** 顶级体育项目 */
  const sportHotGames = computed<Menu>(() => {
    if (sidebarData.value && sidebarData.value.menu) {
      // eslint-disable-next-line max-len
      const topGamesObj = sidebarData.value.menu.find(a => a.menu_id === 3) ?? { list: [] }

      return topGamesObj?.list?.map((sport) => {
        return {
          title: sport.sn,
          path: '',
          icon: sport.spic,
          useCloudImg: true,
          domId: `sports-hot-game-${sport.si}`,
          list: [
            // eslint-disable-next-line max-len
            { title: 'Live & Upcoming', path: `/sports/${SPORTS_PLAT_ID}/${sport.si}`, icon: 'spt-ball-plate' },
            // eslint-disable-next-line max-len
            { title: 'Outrights', path: `/sports/${SPORTS_PLAT_ID}/${sport.si}?outrights=2`, icon: 'spt-timing' },
            ...sport.list.map((league) => {
              return {
                title: league.cn,
                icon: league.cpic,
                useCloudImg: true,
                path: `/sports/${SPORTS_PLAT_ID}/${sport.si}/${league.pgid}/${league.ci}`,
              }
            }),
          ],
        }
      })
    }
    return []
  })

  /** 体育项目 */
  const sportGameList = computed(() => {
    if (sidebarData.value && sidebarData.value.all) {
      const list = sidebarData.value.all.map((item) => {
        return {
          title: item.sn,
          path: `/sports/${SPORTS_PLAT_ID}/${item.si}`,
          icon: item.spic,
          useCloudImg: true,
        }
      })
      return [
        {
          title: t('sports_events'),
          path: '',
          icon: 'spt-basketball',
          list,
          domId: 'sports-game-list',
        },
      ]
    }
    return []
  })

  /** 滚球导航 */
  const sportLiveNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.lc > 0).map((b) => {
        return {
          ...b, icon: b.spic, count: b.lc, useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 即将开赛导航 */
  const upcomingNavs = computed(() => {
    if (allSportsCount.value) {
      return [
        // eslint-disable-next-line max-len
        { si: 0, sn: t('finance_other_tab_all'), icon: 'uni-all', count: allSportsCount.value.nc },
        ...allSportsCount.value.list.filter(a => a.nc > 0).map((b) => {
          return {
            ...b, icon: b.spic, count: b.nc, useCloudImg: true,
          }
        })]
    }
    return []
  })

  /** 所有球种的si */
  const allSportsSi = computed(() => {
    if (sidebarData.value && sidebarData.value.all)
      return sidebarData.value.all.map(a => a.si)
    return []
  })

  /** 所有球种名称sid对应列表 */
  const allSportsNameList = computed(() => {
    if (sidebarData.value && sidebarData.value.all)
      return sidebarData.value.all
    return []
  })

  const sportOddType = computed(() => <Menu>[
    {
      title: `${t('sports_odds_title')}： ${t(sportsOddsType.value)}`,
      path: '',
      icon: 'spt-odds',
      type: 'radio',
      value: sportsOddsType.value,
      radioChange: (val: EnumSportsOddsType) => setSportsOddsType(val),
      list: AllOddsTypes.value,
      domId: 'sports-odds-type',
    },
  ])

  /** 切换场馆 */
  function changeProvider(id: string) {
    if (currentProvider.value === id)
      return
    currentProvider.value = id
    Local.set(STORAGE_SPORTS_CURRENT_PROVIDER, id)
  }

  /** 渲染赔率 */
  const renderOdds = (odds: number) => {
    return computed(() => {
      return Number(SportsOdds.convert(odds, sportsOddsType.value))
    })
  }

  /** 设置当前体育赔率展示方式 */
  function setSportsOddsType(type: EnumSportsOddsType) {
    sportsOddsType.value = type
    Local.set(STORAGE_SPORTS_ODDS_TYPE_KEY, type)
  }

  /** 获取当前体育赔率展示方式 */
  function getSportsOddsType() {
    const value = Local.get<EnumSportsOddsType>(STORAGE_SPORTS_ODDS_TYPE_KEY)?.value
    if (value)
      return value
    else
      return EnumSportsOddsType.DECIMAL
  }

  /** 更新收藏赛事列表 */
  function refreshSportsFavList() {
    runGetFavoriteList({
      sis: allSportsSi.value,
      cur: currencyConfig[currentGlobalCurrency.value].cur,
    })
  }

  return {
    AllOddsTypes,
    sportsOddsType,
    sportOddType,
    betSlipData,
    currentProvider,
    providerList,
    allSportsCount,
    sidebarData,
    liveCount,
    sportsMenu,
    sportHotGames,
    sportGameList,
    sportLiveNavs,
    currentLiveNav,
    upcomingNavs,
    currentUpcomingNav,
    sportsFavoriteData,
    allSportsSi,
    allSportsNameList,
    cart,
    renderOdds,
    setSportsOddsType,
    getSportsOddsType,
    changeProvider,
    refreshSportsFavList,
    runSportsCount,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSportsStore, import.meta.hot))
