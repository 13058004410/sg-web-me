<script setup lang='ts'>
import type { EnumCurrencyKey } from '~/apis/types'

const { t } = useI18n()
const {
  currentGlobalCurrency,
  userInfo,
} = storeToRefs(useAppStore())
const {
  renderBalanceList,
} = useCurrencyData()
const { getRate, runGetExchangeRate } = useExchangeRate()
const { openNotify } = useNotify()
const appStore = useAppStore()

function initCurrencyTypePay() {
  const balance = renderBalanceList.value.find(a => a.type === currentGlobalCurrency.value)?.balance
  if (balance && +balance > 0)
    return currentGlobalCurrency.value

  if (renderBalanceList.value.some(a => +a.balance > 0))
    return renderBalanceList.value.filter(b => +b.balance > 0)[0].type

  return currentGlobalCurrency.value
}

const currencyTypePay = ref(initCurrencyTypePay())
const currencyTypeGet = ref<EnumCurrencyKey>(
  currentGlobalCurrency.value === 'USDT'
    ? renderBalanceList.value.filter(a => a.type !== currencyTypePay.value)[0].type
    : 'USDT',
)

const currencyCodePay = computed(() => {
  return renderBalanceList.value.find(a => a.type === currencyTypePay.value)?.cur ?? '701'
})
const currencyCodeGet = computed(() => {
  return renderBalanceList.value.find(a => a.type === currencyTypeGet.value)?.cur ?? '701'
})
const currencyPayOptions = computed(() => {
  if (renderBalanceList.value.some(a => +a.balance > 0)) {
    return renderBalanceList.value.filter(b => +b.balance > 0).map((a) => {
      return {
        label: a.type,
        value: a.type,
        currencyType: a.type,
      }
    })
  }
  return renderBalanceList.value.map((a) => {
    return {
      label: a.type,
      value: a.type,
      currencyType: a.type,
    }
  })
})
const currencyGetOptions = computed(() => {
  return renderBalanceList.value.filter(a => a.type !== currencyTypePay.value).map((b) => {
    return {
      label: b.type,
      value: b.type,
      currencyType: b.type,
    }
  })
})
const rate = computed(() => {
  const r = getRate(currencyTypePay.value, currencyTypeGet.value, 9)?.targetNum
  return scientificToString(r ? +r : 1)
})
const currencyMaxBalance = computed(() => userInfo.value?.balance[currencyTypePay.value] ?? 0)

const {
  value: amountGet,
  errorMessage: errorGet,
  setValue: setAmountGet,
  resetField: resetAmountGet,
} = useField<string>('amountGet', (v) => {
  return ''
})
const {
  value: amountPay,
  errorMessage: errorPay,
  setValue: setAmountPay,
  resetField: resetAmountPay,
} = useField<string>('amountPay', (v) => {
  return ''
})

// 禁用提交按钮
const submitDisabled = computed(() => {
  if (!amountGet.value || !amountPay.value)
    return true

  const isVirtual = application.isVirtualCurrency(currencyTypeGet.value)
  return isVirtual
    ? +amountGet.value < 0.00000001 || +amountPay.value < 0.00000001
    : +amountGet.value < 0.01 || +amountPay.value < 0.01
})

const { run, loading } = useRequest(ApiFinanceBalanceTransfer, {
  onSuccess(res) {
    openNotify({
      type: 'success',
      title: t('exchange'),
      message: t('exchange') + t('notify_title_success'),
    })
    appStore.getBalanceData()
    resetAmountPay()
    resetAmountGet()
  },
})

// 设置兑换金额保留指定位数
function setAmountGetWithToFixed(amount: string) {
  setAmountGet(toFixed(+amount, application.getCurrencySuffixLength(currencyTypeGet.value)))
}
// 设置支付金额保留指定位数
function setAmountPayWithToFixed(amount: string) {
  setAmountPay(toFixed(+amount, application.getCurrencySuffixLength(currencyTypePay.value)))
}
// 支付金额输入时
function onAmountPayInput(v: string) {
  setAmountGetWithToFixed(mul(+v, +rate.value))
}
// 兑换金额输入时
function onAmountGetInput(v: string) {
  setAmountPayWithToFixed(div(+v, +rate.value))
}
// 确认
function confirm() {
  if (+amountPay.value > 0) {
    run({
      currency_in: currencyCodeGet.value,
      currency_out: currencyCodePay.value,
      amount: amountPay.value,
    })
  }
}
// 切换兑换货币
function onCurrencyGetSelected() {
  nextTick(() => {
    setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  })
}

// 监听支付货币类型
watch(currencyTypePay, (a) => {
  if (currencyTypeGet.value === a)
    currencyTypeGet.value = renderBalanceList.value.filter(a => a.type !== currencyTypePay.value)[0].type

  setAmountPay(userInfo.value?.balance[currencyTypePay.value] ?? '')
  setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})
// 监听支付金额
watch(amountPay, (a) => {
  if (+a > +currencyMaxBalance.value) {
    setAmountPay(`${currencyMaxBalance.value}`)
    setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
  }
})

onMounted(() => {
  runGetExchangeRate()
  setAmountPay(userInfo.value?.balance[currencyTypePay.value] ?? '')
  setAmountGetWithToFixed(mul(+amountPay.value, +rate.value))
})
</script>

<template>
  <div class="flex flex-col gap-14">
    <BaseLabel :label="`${t('pop_up_currency_exchange')} (${currencyTypeGet}):`" must>
      <BaseInput
        v-model="amountGet" type="number" :msg="errorGet" style="--tg-base-input-right-button-padding:0;"
        hide-spin-btn @input="onAmountGetInput"
      >
        <template #right-button>
          <BaseSelect
            v-model="currencyTypeGet" popper :options="currencyGetOptions"
            style="--tg-base-select-popper-style-padding-x:12px;
            --tg-base-select-popper-style-padding-y:12px;
            --tg-base-select-popper-bg-color:transparent;
            --tg-base-select-hover-bg-color:transparent;
            width: 110px;" popper-search :popper-search-placeholder="t('search')" popper-max-height="22em"
            @select="onCurrencyGetSelected"
          >
            <template #label="{ data }">
              <AppCurrencyIcon show-name :currency-type="data?.value" />
            </template>
            <template #option="{ data: { item } }">
              <AppCurrencyIcon show-name :currency-type="item.value" />
            </template>
          </BaseSelect>
        </template>
      </BaseInput>
    </BaseLabel>
    <BaseLabel
      :label="t('pay_with', { currency: currencyTypePay })"
      :right-text="`${t('rate')}${rate}`" must
    >
      <BaseInput
        v-model="amountPay" type="number" :msg="errorPay" style="--tg-base-input-right-button-padding:0;"
        hide-spin-btn @input="onAmountPayInput"
      >
        <template #right-button>
          <BaseSelect
            v-model="currencyTypePay" popper :options="currencyPayOptions"
            style="--tg-base-select-popper-style-padding-x:12px;
            --tg-base-select-popper-style-padding-y:12px;
            --tg-base-select-popper-bg-color:transparent;
            --tg-base-select-hover-bg-color:transparent;
            width: 110px;" popper-search :popper-search-placeholder="t('search')" popper-max-height="22em"
          >
            <template #label="{ data }">
              <AppCurrencyIcon show-name :currency-type="data?.value" />
            </template>
            <template #option="{ data: { item } }">
              <AppCurrencyIcon show-name :currency-type="item.value" />
            </template>
          </BaseSelect>
        </template>
      </BaseInput>
    </BaseLabel>
    <BaseButton
      size="lg" bg-style="secondary" :disabled="submitDisabled || loading"
      :loading="loading" @click="confirm"
    >
      {{ t('pop_up_currency_exchange_button_confirm_pay') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>

</style>
