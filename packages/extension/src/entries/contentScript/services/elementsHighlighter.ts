import { InjectableService } from 'deco-ext'
import {
  HighlighteNodesForSearching,
  HighlighteNodesForHiding,
  BackgroundChangeNodesForHiding
} from '~/entries/contentScript/services/stylesController';

@InjectableService()
export default class ElementHighlighter {
  hideElements?: HTMLElement[]
  searchElements?: HTMLElement[]
  coverDivs?: HTMLElement[]

  private STYLE_FOCUS_FOR_HIDE = 'solid 2px black'
  private STYLE_FOCUS_FOR_SEARCH = 'solid 2px #0db3ea'
  private STYLE_TMP_SELECT_FOR_HIDE = 'dotted 2px black'
  private STYLE_TMP_SELECT_FOR_SEARCH = 'dotted 2px #0db3ea'
  private STYLE_SELECT_FOR_HIDE = 'solid 1px black'
  private STYLE_SELECT_FOR_SEARCH = 'solid 1px #0db3ea'

  coverDivsContainer: Map<HTMLElement, HTMLElement[]> = new Map()

  constructor(
    private readonly highliteNodesForSearching: HighlighteNodesForSearching,
    private readonly highliteNodesForHiding: HighlighteNodesForHiding,
    private readonly backgroundIndicatorHidingNodes: BackgroundChangeNodesForHiding,
  ) {}

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
    this.highliteNodesForSearching.revertAll()
    // Apply Styles
    if (elements) {
      for (let i = 0; i < elements.length; i++) {
        if (!document.getElementById('rule_editor_container')?.contains(elements[i]))
          this.selectForSearch(elements[i])
      }
    }
  }

  selectForHide(element: HTMLElement) {
    this.highliteNodesForHiding.apply(element)
    
    // Change background color
    if (window.getComputedStyle(element).display === 'inline') {
      this.backgroundIndicatorHidingNodes.apply(element)
    }
    // Add transparent cover
    else {
      const elementsToCover = []
      if (element.tagName === 'TR') {
        const children = element.children
        // const children = element.childNodes
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
          if (elementToCover instanceof HTMLElement) {
            elementToCover.style.position = 'relative'
          }
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
        this.coverDivsContainer.set(element, coverDivs)
      }
    }
  }

  unselectForHide(element: HTMLElement) {
    /* Remove transparent cover div elements */
    const coverDivs = this.coverDivsContainer.get(element)
    if (coverDivs) {
      for (let i = 0; i < coverDivs.length; i++) {
        const coverDiv = coverDivs[i]
        coverDiv.parentNode?.removeChild (coverDiv)
      }
      this.coverDivsContainer.delete(element)
      // element.coverDivs = null
    }
    if (this.backgroundIndicatorHidingNodes.hasNode(element)) {
      this.backgroundIndicatorHidingNodes.revert(element)
    }
    this.highliteNodesForHiding.revert(element)
  }

  selectForSearch(element: HTMLElement) {
    this.highliteNodesForSearching.apply(element)
  }

  unselectForSearch(element: HTMLElement) {
    this.highliteNodesForSearching.revert(element)
  }
}
