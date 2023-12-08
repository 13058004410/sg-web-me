export function useLockScroll(show?: boolean | Ref | ComputedRef) {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const scrollTop = ref(0)
  const b = toRef(show)

  function setScrollTop() {
    scrollTop.value = document.scrollingElement?.scrollTop
                        || document.documentElement.scrollTop
                        || document.body.scrollTop
  }

  function lockScroll() {
    if (isSafari) {
      document.body.classList.add('tg-popup-parent--hidden--safari')
      document.body.style.top = `${-scrollTop.value}px`
    }
    else {
      document.body.classList.add('tg-popup-parent--hidden')
    }
  }

  function unlockScroll() {
    if (isSafari) {
      document.body.classList.remove('tg-popup-parent--hidden--safari')
      document.documentElement.scrollTop = document.body.scrollTop = scrollTop.value
    }
    else {
      document.body.classList.remove('tg-popup-parent--hidden')
    }
  }

  const stop = watch(b, (val) => {
    if (show !== void 0) {
      if (val)
        setScrollTop()
      nextTick(() => {
        setTimeout(() => {
          if (val)
            lockScroll()
          else
            unlockScroll()
        }, 50)
      })
    }
  }, { immediate: true })

  if (show === void 0)
    stop()

  return {
    setScrollTop,
    lockScroll,
    unlockScroll,
  }
}
