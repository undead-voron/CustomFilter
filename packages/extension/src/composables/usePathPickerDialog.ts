import type { PathFilter } from '~/types'
import { ref } from 'vue'

export function usePathPickerDialogPosition() {
  const dialogPosition = ref<{ left: number, top: number }>({ left: 0, top: 0 })
  const hasParentNode = ref(false)

  const menuListRef = ref<PathFilter[]>([])

  const show = (
    event: MouseEvent,
    originNode: HTMLElement,
    paths: PathFilter[],
  ) => {
    menuListRef.value = paths
    hasParentNode.value = !!(originNode.parentNode && originNode.parentNode !== document.body)

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    const _left = event.clientX + scrollLeft
    const _top = event.clientY + scrollTop

    dialogPosition.value = { left: _left, top: _top }
  }

  return {
    show,
    dialogPosition,
    menuListRef,
    hasParentNode,
  }
}
