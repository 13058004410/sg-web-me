import { acceptHMRUpdate, defineStore } from 'pinia'
import type { ProviderItem } from '~/apis/types'

export const useCasinoStore = defineStore('casino', () => {
  /** 游戏提供商数据(PG,EVO,...) */
  const { list } = useList(ApiMemberPlatformList, {
    manual: false,
  })
  const platformList = computed(() => {
    const arr: ProviderItem[] = []
    for (let i = 0; i < list.value.length; i++) {
      if (!arr.find(a => a.venue_id === list.value[i].venue_id))
        arr.push(list.value[i])
    }
    return arr
  })

  const { data } = useRequest(ApiMemberGameLobby, { manual: false })

  const casinoNav = computed(() => {
    if (data.value) {
      data.value.navs.unshift({ cid: 'all', name: data.value.name, ty: -1, platform_id: 'all', icon: data.value.icon })
      return data.value.navs.map((a) => {
        return {
          ...a,
          label:
           a.name,
          value: a.ty === 1 ? a.cid : a.platform_id,
        }
      })
    }
    return []
  })
  const casinoGameList = computed(() =>
    data.value
      ? data.value.items.map(a => ({
        ...a,
        title: a.name,
        list: [],
        path: a.ty === 1
          ? `/casino/group/category?cid=${a.cid}&name=${a.name}`
          : `/casino/group/provider?pid=${a.platform_id}&name=${a.name}`,
        useCloudImg: true,
      }))
      : [])

  return {
    platformList,
    casinoNav,
    casinoGameList,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCasinoStore, import.meta.hot))
