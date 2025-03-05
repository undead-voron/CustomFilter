import { onMounted, ref } from 'vue'
import { escapeHTML, trim } from './string-utils'

export default function usePathPickerDialog() {
  const pathPickerDialog = ref<HTMLElement | null>(null)
  const pathPickerUL = ref<HTMLElement | null>(null)
  const currentSearchFilter = ref(null)
  const currentHideFilter = ref(null)
  const currentFilter = ref(null)

  onMounted(() => {
    if (!pathPickerDialog.value) {
      const div = document.createElement('DIV')
      div.id = 'xpath_picker_body'
      div.setAttribute('avoidStyle', 'true')
      div.style.display = 'none'
      div.style.backgroundColor = 'white'
      div.style.zIndex = _zIndex.toString()
      div.style.fontSize = 'small'
      div.style.textAlign = 'left'
      div.style.position = 'absolute'
      div.style.padding = '4px'
      div.style.color = 'black'
      const ul = document.createElement('UL')
      ul.setAttribute('avoidStyle', 'true')
      div.appendChild(ul)
      document.body.appendChild(div)
      pathPickerDialog.value = div
      pathPickerUL.value = ul
    }
  })
  const show = (
    event: MouseEvent,
    originNode: HTMLElement,
    paths,
    /* PathPickerDialog.target... */
    target,
    uppseNodeHandlers,
    onSelect,
  ) => {
    if (!pathPickerUL.value || !pathPickerDialog.value)
      return
    pathPickerUL.value.innerHTML = ''
    if (originNode.parentNode && originNode.parentNode != document.body) {
      const li = document.createElement('LI')
      li.className = 'upper'
      const a = document.createElement('A')
      a.innerHTML = chrome.i18n.getMessage('selectOuterElement')
      a.addEventListener('click', uppseNodeHandlers.click, false)
      a.addEventListener('mouseover', uppseNodeHandlers.mouseover, false)
      a.addEventListener('mouseout', uppseNodeHandlers.mouseout, false)
      li.appendChild(a)
      pathPickerUL.value.appendChild(li)
    }

    for (const i = 0, l = paths.length; i < l; i++) {
      const li = document.createElement('LI')
      li.setAttribute('avoidStyle', 'true')

      const a = document.createElement('A')
      a.setAttribute('avoidStyle', 'true')
      a.setAttribute('href', 'javascript:void(0)')

      const span = document.createElement('SPAN')
      span.className = 'xpath'
      span.innerHTML = escapeHTML(trim(paths[i].path))

      const badge = document.createElement('SPAN')
      badge.className = 'badge'
      badge.innerHTML = paths[i].elements.length

      a.appendChild(badge)
      a.appendChild(span)

      a.addEventListener('click', this.getOnclickAction(paths[i], target, onSelect), false)
      a.addEventListener('mouseover', this.getOnmouseoverAction(paths[i], target), false)
      li.appendChild(a)
      pathPickerUL.value.appendChild(li)
    }

    pathPickerDialog.value.style.display = 'block'
    console.log(`PathPicker content = ${pathPickerDialog.value.innerHTML}`)

    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
    let _left = event.clientX + scrollLeft
    let _top = event.clientY + scrollTop

    if (_left + pathPickerDialog.value.clientWidth > scrollLeft + window.innerWidth) {
      _left = scrollLeft + window.innerWidth - pathPickerDialog.value.clientWidth
    }

    if (_top + pathPickerDialog.value.clientHeight > scrollTop + window.innerHeight) {
      _top = scrollTop + window.innerHeight - pathPickerDialog.value.clientHeight
    }

    pathPickerDialog.value.style.left = `${_left}px`
    pathPickerDialog.value.style.top = `${_top}px`

    const localFilter = (target.isToHide) ? currentHideFilter.value : currentSearchFilter.value
    if (currentFilter.value !== localFilter) {
      let elements = currentFilter.value.elements
      for (let i = 0, l = elements.length; i < l; i++) {
        if (elements[i].tmpUnselect)
          elements[i].tmpUnselect()
      }
    }
  }
  const close = () => {
    if (pathPickerDialog.value) {
      pathPickerDialog.value.style.display = 'none'
    }
  }
  const getOnclickAction = (
    filter,
    /* PathPickerDialog.target... */
    target,
    onSelect,
  ) => {
    return function (_event: Event) {
      const path = trim(filter.path)

      if (onSelect) {
        onSelect(target.label, path)
      }

      if (target.isToHide)
        currentHideFilter.value = filter
      else currentSearchFilter.value = filter

      currentFilter.value = filter
      close()
    }
  }
  return {
    pathPickerDialog,
    show,
  }
}

