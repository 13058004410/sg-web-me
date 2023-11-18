import AppVirAddressDialog from '~/components/AppVirAddressDialog.vue'

export function useVirAddressDialog(headMsg:
{ title: string
  icon: string
}) {
  const {
    openDialog: openVirAddressDialog,
    closeDialog: closeVirAddressDialog,
  } = useDialog({
    title: headMsg.title,
    icon: `coin-${headMsg.icon.toLocaleLowerCase()}-title`,
    default: obj => h(AppVirAddressDialog, obj),
  })

  return {
    openVirAddressDialog,
    closeVirAddressDialog,
  }
}
