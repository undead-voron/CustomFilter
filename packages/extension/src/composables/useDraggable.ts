import type { ComponentPublicInstance, Ref } from 'vue'
import Draggable from 'draggable'
import { computed, watch } from 'vue'

interface Options {
  onTrackDragEvent?: () => void
  targetQuerySelector?: string
}

export default function useDraggable(
  target: Ref<ComponentPublicInstance | null> | Ref<Element | null>,
  options: Options = {},
): void {
  const extensionElement = computed(() => {
    const targetValue = target.value

    if (targetValue instanceof Element)
      return targetValue

    return targetValue?.$el ?? null
  })

  let hasMoved = false

  watch(extensionElement, (el: Element | null) => {
    if (el === null)
      return

    let targetElement: Element | null = el

    if (options.targetQuerySelector)
      targetElement = targetElement.querySelector(options.targetQuerySelector)

    if (targetElement === null)
      throw new Error('Missing target element, query selector not found.')

    const handle = targetElement.querySelector('.drag-handle')

    if (!handle)
      throw new Error('Missing handle element, query selector not found.')

    // eslint-disable-next-line no-new
    new Draggable(targetElement, {
      handle,
      setCursor: false,
      setPosition: false,
      limit: (x: number, y: number) => {
        const width = targetElement!.clientWidth
        const height = targetElement!.clientHeight
        const right = document.documentElement.clientWidth
        const bottom = document.documentElement.clientHeight
        if (x < 0)
          x = 0
        else if (x + width >= right)
          x = right - width
        if (y < 0)
          y = 0
        else if (y + height > bottom)
          y = bottom - height
        return { x, y }
      },
      onDrag: () => {
        if (!hasMoved) {
          if (options.onTrackDragEvent) {
            options.onTrackDragEvent()
          }
        }

        hasMoved = true
      },
    })
  })
}
