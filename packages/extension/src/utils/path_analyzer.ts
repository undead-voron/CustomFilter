import type { PathFilter } from '~/services/types'
import { usePathAnalyzer } from '~/composables/usePath'

/**
 * PathAnalyzer
 */
/*
 * Usage
 *     var analyzer = new PathAnalyzer(node, (Xpath|Css)Builder, (true|false));
 *     var list = analyzer.createPathList();
 */
export class PathAnalyzer {
  private analyzer: ReturnType<ReturnType<typeof usePathAnalyzer>['createPathAnalyzer']>
  static SEQ_LIMIT: number = 2

  constructor(targetNode: HTMLElement, builder: any, rootNode?: HTMLElement, basePath?: string) {
    const { createPathAnalyzer } = usePathAnalyzer()
    this.analyzer = createPathAnalyzer(targetNode, builder, rootNode, basePath)
  }

  public createPathList(): PathFilter[] {
    return this.analyzer.createPathList()
  }

  // Maintaining the static method for backward compatibility
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
