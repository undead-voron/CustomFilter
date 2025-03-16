import { readonly, ref } from 'vue'

export function useNotification(delay: number = 3000) {
  const isVisible = ref(false)
  let timeout: number | null = null
  const hide = () => {
    isVisible.value = false
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = null
  }
  const show = () => {
    isVisible.value = true
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(hide, delay)
  }
  return {
    isVisible: readonly(isVisible),
    show,
    hide,
  }
}
