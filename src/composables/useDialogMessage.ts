import AppDialogMessage from '~/components/AppDialogMessage.vue'

export function useDialogMessage() {
  const { t } = useI18n()

  const { openDialog: openMessageDialog, closeDialog: closeMessageDialog } = useDialog({
    title: t('site_message'),
    icon: 'navbar-notice',
    default: () => h(AppDialogMessage),
  })

  return {
    openMessageDialog,
    closeMessageDialog,
  }
}
