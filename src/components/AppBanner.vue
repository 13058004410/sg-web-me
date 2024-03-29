<script setup lang="ts">
import type { BannerItem } from '~/types'

interface Props {
  type?: 'casino' | 'sports'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'casino',
})

const { appContentWidth } = storeToRefs(useWindowStore())

const {
  runAsync: runMemberBannerV2List,
  data: bannerList,
} = useRequest(ApiMemberBannerV2List)

const mgt = computed(() => {
  if (appContentWidth.value < 600)
    return '0'
  else
    return 'var(--tg-spacing-12)'
})

const items = computed(() => {
  if (bannerList.value === undefined || bannerList.value.length === 0)
    return []

  return bannerList.value.map<BannerItem>((item) => {
    const bannerInfo = item.banner_info

    return {
      imgUrl: item.jump_url,
      type: item.jump_type,
      backgroundUrl: bannerInfo.background,
      rightImageUrl: bannerInfo.icon,
      content: bannerInfo.content.zh_CN,
      align: item.banner_style === 1 ? 'left' : 'right',
      banner_style: item.banner_style,
      title: bannerInfo.title ? bannerInfo.title[getCurrentLanguageForBackend()] : '',
      superscript: bannerInfo.superscript ? bannerInfo.superscript[getCurrentLanguageForBackend()] : '',
      banner_style3_background: item.banner_url ? item.banner_url[getCurrentLanguageForBackend()] : '',
      button: bannerInfo.button_state === 1
        ? {
            text: bannerInfo.button_content.zh_CN,
            url: bannerInfo.button_jump_url,
            type: bannerInfo.button_jump_type,
          }
        : undefined,
    }
  })
})

function fetchDataOrLoadImage() {
  return new Promise((resolve, reject) => {
    runMemberBannerV2List({
      banner_type: props.type === 'casino' ? 1 : 2,
    }).then(async () => {
      const urls = items.value.reduce<Promise<any>[]>((acc, item) => {
        if (item.banner_style === 3)
          acc.push(application.loadImage(item.banner_style3_background))

        else
          acc.push(application.loadImage(item.backgroundUrl), application.loadImage(item.rightImageUrl))

        return acc
      }, [])
      await application.allSettled(urls)
      resolve(true)
    }).catch(() => {
      reject(new Error('fetch data error'))
    })
  })
}

await application.allSettled([fetchDataOrLoadImage()])
</script>

<template>
  <div
    class="app-banner" :style="{
      marginTop: mgt,
    }"
  >
    <BaseSwipe v-if="items && items.length" :items="items" />
  </div>
</template>

<style lang="scss" scoped>
</style>
