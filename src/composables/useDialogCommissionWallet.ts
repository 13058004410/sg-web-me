import AppCommissionWalletDialog from '~/components/AppCommissionWalletDialog.vue'

export function useDialogCommissionWallet() {
  const { t } = useI18n()
  const title = computed(() => t('commission_wallet'))
  const {
    openDialog: openCommissionWalletDialog,
    closeDialog: closeCommissionWalletDialog,
  } = useDialog({
    title: title.value,
    icon: 'chess-affiliate',
    default: () => h(AppCommissionWalletDialog),
  })

  return {
    openCommissionWalletDialog,
    closeCommissionWalletDialog,
  }
}
