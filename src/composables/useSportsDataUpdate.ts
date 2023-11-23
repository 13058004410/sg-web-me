/**
 * 更新数据定时器
 * @param callback
 * @param duration 单位/秒
 */
export function useSportsDataUpdate(callback: () => void, duration = 10) {
  let timer: any = null

  function startTimer() {
    if (timer)
      stopTimer()

    timer = setInterval(() => callback(), duration * 1000)
  }

  function stopTimer() {
    clearInterval(timer)
    timer = null
  }

  return { startTimer, stopTimer }
}
