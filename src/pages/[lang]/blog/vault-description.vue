<script setup lang='ts'>
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())

const curType = ref('')

const { data, runAsync } = useRequest(ApiMemberInterestGetConfig)

const minDepositAmount = computed(() => {
  if (data.value)
    return data.value.find(a => a.currency_name === curType.value)?.min_deposit ?? 0

  return 0
})
const interestRate = computed(() => {
  if (data.value)
    return data.value.find(a => a.currency_name === curType.value)?.interest_rate ?? 0
  return 0
})

function changeCurrency(v: any) {
  curType.value = v.type
}

await application.allSettled([runAsync()])
</script>

<template>
  <div class="md:bg-tg-secondary-dark mx-auto max-w-650 select-none md:my-16 md:rounded-[8px] md:p-20">
    <div class="flex justify-between px-2 py-19 md:px-15 md:py-17">
      <div class="text-tg-secondary-light max-w-160 w-full text-center text-[14px] font-semibold leading-[20px]">
        {{ t('currency_type') }}
      </div>
      <div class="text-tg-secondary-light max-w-160 w-full text-center text-[14px] font-semibold leading-[20px]">
        {{ t('min_deposit_amount') }}
      </div>
      <div class="text-tg-secondary-light max-w-160 w-full text-center text-[14px] font-semibold leading-[20px]">
        {{ t('annual_interest_rate') }}
      </div>
    </div>
    <div class="bg-tg-secondary-grey flex items-center justify-between rounded-[4px] px-2 md:px-15">
      <div class="text-tg-secondary-light max-w-160 w-full flex flex-col items-center text-center text-[14px] font-semibold leading-[20px]">
        <AppSelectCurrency
          :type="4"
          :show-balance="false"
          popper-clazz="app-wallet-cur"
          placeholder="search"
          :active-currency-list="data ?? []"
          :style="`--tg-app-select-currency-padding-x:0;--tg-app-select-currency-bg:transparent;
          --tg-app-select-currency-padding-y:${isMobile ? '19px' : '17px'};`"
          @change="changeCurrency"
        />
      </div>
      <div class="text-tg-secondary-light max-w-160 w-full text-center text-[14px] font-semibold leading-[20px]">
        {{ application.numberToLocaleString(+minDepositAmount) }}
      </div>
      <div class="text-tg-secondary-light max-w-160 w-full text-center text-[14px] font-semibold leading-[20px]">
        {{ `${application.numberToLocaleString(+interestRate)}%` }}
      </div>
    </div>

    <div class="mt-34 md:mt-23">
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_1') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_2_1') }}
          <span class="">
            {{ t('vault_des_casino') }}
          </span>
          {{ t('vault_des_2_2') }}
          <span class="">
            {{ t('vault_des_sports') }}
          </span>
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_3') }}

          <span class="">
            Meibo.com
          </span>
          {{ t('period') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_4') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_5') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_6') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_7') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-12 ml-[32px] list-disc text-[14px] font-semibold leading-[1.42]">
        <li><div>{{ t('vault_des_li1') }}</div></li>
        <li><div>{{ t('vault_des_li2') }}</div></li>
        <li>
          <div>
            {{ t('vault_des_li3_1') }}
            <span class="">{{ t('vault_des_li3_2') }}</span>
          </div>
        </li>
        <li><div>{{ t('vault_des_li4') }}</div></li>
        <li><div>{{ t('vault_des_li5') }}</div></li>
      </ul>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_8') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_9') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_10') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_11') }}
          <span class="">{{ t('vault_des_card') }}</span>
          <span class="">{{ t('vault_des_dice') }}</span>
          <span class="">{{ t('vault_des_slots') }}</span>
          {{ t('vault_des_12') }}
          <span class="">{{ t('vault_des_live') }}</span>
          {{ t('and') }}
          <span class="">{{ t('vault_des_upcoming') }}</span>
          {{ t('vault_des_13') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_14') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_15') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_16') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_17') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_18') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_19') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-12 ml-[32px] list-disc text-[14px] font-semibold leading-[1.42]">
        <li><div>{{ t('vault_des_li6') }}</div></li>
        <li><div>{{ t('vault_des_li7') }}</div></li>
        <li><div>{{ t('vault_des_li8') }}</div></li>
        <li><div>{{ t('vault_des_li9') }}</div></li>
        <li><div>{{ t('vault_des_li10') }}</div></li>
        <li><div>{{ t('vault_des_li11') }}</div></li>
      </ul>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_20') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_21') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_22') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_23') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_24') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_25') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_26') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_27') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_28') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_29') }}
        </div>
      </div>
      <ul class="text-tg-secondary-light mb-12 ml-[32px] list-disc text-[14px] font-semibold leading-[1.42]">
        <li><div>{{ t('vault_des_li12') }}</div></li>
        <li><div>{{ t('vault_des_li13') }}</div></li>
        <li><div>{{ t('vault_des_li14') }}</div></li>
        <li><div>{{ t('vault_des_li15') }}</div></li>
        <li><div>{{ t('vault_des_li16') }}</div></li>
        <li><div>{{ t('vault_des_li17') }}</div></li>
        <li><div>{{ t('vault_des_li18') }}</div></li>
        <li><div>{{ t('vault_des_li19') }}</div></li>
        <li><div>{{ t('vault_des_li20') }}</div></li>
        <li><div>{{ t('vault_des_li21') }}</div></li>
        <li><div>{{ t('vault_des_li22') }}</div></li>
        <li><div>{{ t('vault_des_li23') }}</div></li>
        <li><div>{{ t('vault_des_li24') }}</div></li>
        <li><div>{{ t('vault_des_li25') }}</div></li>
        <li><div>{{ t('vault_des_li26') }}</div></li>
        <li><div>{{ t('vault_des_li27') }}</div></li>
        <li><div>{{ t('vault_des_li28') }}</div></li>
        <li><div>{{ t('vault_des_li29') }}</div></li>
        <li><div>{{ t('vault_des_li30') }}</div></li>
      </ul>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_30') }}
        </div>
      </div>
      <!-- 🔖🔖🔖 -->
      <div>
        <div class="text-tg-text-white mb-8 text-[18px] font-semibold leading-[1.42]">
          {{ t('vault_des_31') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_32') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_33') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_34') }}
        </div>
      </div>
      <div>
        <div class="text-tg-secondary-light mb-12 text-[14px] font-semibold leading-[1.42]">
          {{ t('vault_des_35') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
name: blog
meta:
  layout: home
  </route>
