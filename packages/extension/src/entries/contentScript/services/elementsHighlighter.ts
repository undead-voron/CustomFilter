import { InjectableService } from 'deco-ext'

@InjectableService()
export default class ElementHighlighter {
  hideElements?: HTMLElement[]
  searchElements?: HTMLElement[]
  coverDivs?: HTMLElement[]
  STYLE_FOCUS_FOR_HIDE = 'solid 2px black'
  STYLE_FOCUS_FOR_SEARCH = 'solid 2px #0db3ea'
  STYLE_TMP_SELECT_FOR_HIDE = 'dotted 2px black'
  STYLE_TMP_SELECT_FOR_SEARCH = 'dotted 2px #0db3ea'
  STYLE_SELECT_FOR_HIDE = 'solid 1px black'
  STYLE_SELECT_FOR_SEARCH = 'solid 1px #0db3ea'

  highlightHideElements(elements?: HTMLElement[]) {
    if (this.hideElements) {
      for (let i = 0, l = this.hideElements.length; i < l; i++) {
        if (!document.getElementById('rule_editor_container')?.contains(this.hideElements[i]))
          this.unselectForHide(this.hideElements[i])
      }
    }
    // Apply Styles
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        if (!document.getElementById('rule_editor_container')?.contains(elements[i]))
          this.selectForHide(elements[i])
      }
    }
    this.hideElements = elements
  }

  highlightSearchElements(elements?: HTMLElement[]) {
    if (this.searchElements) {
      for (let i = 0, l = this.searchElements.length; i < l; i++) {
        if (document.getElementById('rule_editor_container')?.contains(this.searchElements[i]))
          this.unselectForSearch(this.searchElements[i])
      }
    }
    // Apply Styles
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        if (document.getElementById('rule_editor_container')?.contains(elements[i]))
          this.selectForSearch(elements[i])
      }
    }
    this.searchElements = elements
  }

  selectForHide(element) {
    if (element.originalStyle == null)
      element.originalStyle = (element.style.outline != null) ? element.style.outline : ' '
    element.isSelectedForHide = true
    element.style.outline = this.STYLE_SELECT_FOR_HIDE

    // Change background color
    if (window.getComputedStyle(element).display === 'inline') {
      element.originalBackgroundColor = window.getComputedStyle(element).backgroundColor
      element.style.backgroundColor = '#bbb'
      element.backgroundColorChanged = true
    }
    // Add transparent cover
    else {
      const elementsToCover = []
      if (element.tagName === 'TR') {
        const children = element.childNodes
        for (let i = 0; i < children.length; i++) {
          if (children[i].tagName) {
            elementsToCover.push(children[i])
          }
        }
      }
      else {
        elementsToCover.push(element)
      }
      if (elementsToCover.length > 0) {
        const coverDivs = []
        for (let i = 0; i < elementsToCover.length; i++) {
          const elementToCover = elementsToCover[i]
          elementToCover.style.position = 'relative'
          const div = document.createElement('DIV')
          div.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
          div.style.position = 'absolute'
          div.style.left = '0px'
          div.style.top = '0px'
          div.style.border = '2px inset #2fb947'
          div.style.width = `${elementToCover.clientWidth}px`
          div.style.height = `${elementToCover.clientHeight}px`
          elementToCover.appendChild(div)
          coverDivs.push(div)
        }
        element.coverDivs = coverDivs
      }
    }
  }

  unselectForHide(element) {
    /* Remove transparent cover div elements */
    if (element.coverDivs) {
      for (let i = 0; i < element.coverDivs.length; i++) {
        const coverDiv = element.coverDivs[i]
        coverDiv.parentNode.removeChild (coverDiv)
      }
      element.coverDivs = null
    }
    if (element.backgroundColorChanged) {
      element.style.backgroundColor = element.originalBackgroundColor
      element.originalBackgroundColor = null
      element.backgroundColorChanged = false
    }
    element.isSelectedForHide = false
    if (element.isSelectedForSearch)
      element.style.outline = this.STYLE_SELECT_FOR_SEARCH
    else
      element.style.outline = element.originalStyle
  }

  selectForSearch(element) {
    if (element.originalStyle == null)
      element.originalStyle = (element.style.outline != null) ? element.style.outline : ''
    element.isSelectedForSearch = true
    element.style.outline = this.STYLE_SELECT_FOR_SEARCH
  }

  unselectForSearch(element) {
    element.isSelectedForSearch = false
    if (element.isSelectedForHide)
      element.style.outline = this.STYLE_SELECT_FOR_HIDE
    element.style.outline = element.originalStyle
  }
}
