import { acceptHMRUpdate, defineStore } from 'pinia'

export const useCasinoStore = defineStore('casino', () => {
  const { data } = useRequest(ApiMemberGameLobby, { manual: false })

  const casinoNav = computed(() => {
    if (data.value) {
      data.value.navs.unshift({ cid: 'all', name: data.value.name, ty: 2, platform_id: 'all', icon: data.value.icon })
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
      }))
      : [])

  return {
    casinoNav,
    casinoGameList,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot))
