import type { PathFilter } from '~/services/types'
import { arrayContains } from './array-utils'
import { isContained } from './dom-utils'

/**
 * PathElement
 */
const splitSpacesRegExp = /[ \n]+/g
class PathElement {
  node
  builder
  isTarget: boolean
  parentNode
  upperKeyNode
  classes
  options: string[]
  constructor(node, index: number, builder) {
    this.node = node
    this.builder = builder
    this.isTarget = false
    this.parentNode = null
    this.upperKeyNode = null
    this.classes = (node.className == null || node.className === '') ? [] : node.className.replace(splitSpacesRegExp, ' ').split(' ')

    const tagName = this.node.tagName

    this.options = []
    if ((this.classes.length > 1 || index === 0) && tagName !== 'BODY') {
      for (let i = 0, l = this.classes.length; i < l; i++) {
        if (this.classes[i] === '')
          continue
        const xpath = this.builder.getMultipleTagNameAndClassNameExpression(tagName, this.classes[i])
        this.options.push(xpath)
      }
    }
    else if (this.classes.length === 1 && tagName !== 'BODY') {
      const className = this.classes[0]
      this.options.push(this.builder.getSingleTagNameAndClassNameExpression(this.node.tagName, className))
    }
    if (tagName !== 'DIV' && tagName !== 'UL')
      this.options.push(this.node.tagName)
  }
}

/**
 * PathAnalyzer
 */
/*
 * Usage
			var analyzer = new PathAnalyzer(node, (Xpath|Css)Builder, (true|false));
			var list = analyzer.createPathList();
 */
export class PathAnalyzer {
  builder: any
  targetNode: any
  rootNode: any
  basePath: any
  pathList: PathFilter[]
  ancestors: PathElement[]
  seqList
  static SEQ_LIMIT: number
  uniqPathList: string[]

  constructor(targetNode, builder, rootNode, basePath) {
    this.builder = builder
    this.targetNode = targetNode
    this.rootNode = rootNode || document.body // User Relatve Path
    this.basePath = basePath || ''
    this.pathList = null
    this.ancestors = [] /* <PathElement> */
  }

  public createPathList(): PathFilter[] {
    {
      let node = this.targetNode
      let index = 0
      while (node) {
        if (this.rootNode === node)
          break
        const element = new PathElement(node, index, this.builder)
        this.ancestors.push(element)
        node = node.parentNode
        index++
      }
    }
    for (let i = 0, l = this.ancestors.length; i < l; i++) {
      const childNode = (i > 0) ? this.ancestors[i - 1] : null
      const node = this.ancestors[i]
      node.isTarget = (i === 0)
    }
    this.seqList = []
    this.pathList = []
    this.uniqPathList = []
    if (this.ancestors.length > 0)
      this.scan(0, [])
    if (this.basePath.length > 0) {
      this.pathList.push(this.builder.createPathFilter(this.basePath))
    }
    for (let i = 0, l = this.uniqPathList.length; i < l; i++) {
      try {
        const path = this.builder.createPathFilter(this.basePath + this.uniqPathList[i])
        // Exclude nested elements
        let nested = false
        for (let elementIndex = 0; elementIndex < path.elements.length; elementIndex++) {
          const element = path.elements[elementIndex]
          if (element !== this.targetNode
            && (isContained(this.targetNode, element) || isContained(element, this.targetNode))) {
            nested = true
          }
        }
        if (!nested)
          this.pathList.push(path)
      }
      catch (ex) {
        console.log(ex)
      }
    }
    this.pathList.sort(
      (a: PathFilter, b: PathFilter) => {
        return (a.elements.length === b.elements.length)
          ? (a.path.length - b.path.length)
          : (a.elements.length - b.elements.length)
      },
    )
    const list: PathFilter[] = []
    let prevPath = null
    for (let i = 0, l = this.pathList.length; i < l; i++) {
      const path = this.pathList[i]
      if (!prevPath || prevPath.elements.length !== path.elements.length) {
        list.push(path)
      }
      prevPath = path
    }
    return list
  }

  scan(index, seq): void {
    const current = this.ancestors[index]
    for (let i = 0, l = current.options.length; i < l; i++) {
      const cloneSeq = PathAnalyzer.cloneArray(seq)
      const option = current.options[i]
      cloneSeq.push({ path: option, index })
      if (cloneSeq.length < PathAnalyzer.SEQ_LIMIT && this.ancestors.length > index + 1)
        this.scan(index + 1, PathAnalyzer.cloneArray(PathAnalyzer.cloneArray(cloneSeq)))
      this.addSeq(cloneSeq)
    }
    // Add Nothing
    if (index > 0 && seq.length < PathAnalyzer.SEQ_LIMIT && this.ancestors.length > index + 1)
      this.scan(index + 1, PathAnalyzer.cloneArray(seq))
    if (this.rootNode === document.body && current.node.id) {
      const cloneSeq = PathAnalyzer.cloneArray(seq)
      cloneSeq.push({ path: this.builder.getIdExpression(current.node.id), index, hasId: true })
      this.addSeq(cloneSeq)
    }
  }

  addSeq(seq): void {
    let str = ''
    for (let i = 0, l = seq.length; i < l; i++) {
      const next = (i < l - 1) ? seq[i + 1] : null
      const current = seq[i]
      str = current.path + str
      if (current.hasId) {

      }
      else if ((next && next.index === current.index + 1) || current.path === 'BODY') {
        str = this.builder.getChildSeparator() + str
      }
      else {
        str = this.builder.getDescendantSeparator() + str
      }
    }
    if (!arrayContains(this.uniqPathList, str))
      this.uniqPathList.push(str)
  }

  static cloneArray(orig: any[]): any[] {
    const array = []
    for (let i = 0, l = orig.length; i < l; i++) {
      array[i] = { path: orig[i].path, index: orig[i].index }
    }
    return array
  }

  static initialize(): void {
    PathAnalyzer.SEQ_LIMIT = 2
  }
}
