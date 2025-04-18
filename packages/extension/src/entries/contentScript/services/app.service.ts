import { InjectableService, messageData, onMessage } from 'deco-ext'
import { type App, createApp } from 'vue'
import RulesEditor from '~/entries/contentScript/components/App.vue'
import ElementHighlighter from '~/entries/contentScript/services/elementsHighlighter'
import RulesExecutor from '~/entries/contentScript/services/rulesExecutor'
import { TestNodes } from '~/entries/contentScript/services/stylesController'
import ExtensionStateService from '~/services/extensionState'
import RulesSevice from '~/services/storage'
import { Rule } from '~/types'
import renderContent from '../../../utils/renderContent'
import { logInfo } from '~/utils'

@InjectableService()
export default class Main {
  ui?: App
  appRoot?: HTMLElement
  constructor(
    protected rulesExecutor: RulesExecutor,
    protected elementsHighliter: ElementHighlighter,
    protected cbStorage: RulesSevice,
    protected testNodesList: TestNodes,
    protected extensionState: ExtensionStateService,
  ) {}

  async init() {
    renderContent(
      import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      (appRoot: HTMLElement) => {
        this.appRoot = appRoot
      },
    )
    this.extensionState.addStateUpdateListener(() => {
      if (this.extensionState.isDisabled) {
        this.unmount()
      }
    })
  }

  @onMessage({ key: 'createRule' })
  createRule() {
    const rule = this.cbStorage.createRule()
    this.mountEditor(rule)
  }

  @onMessage({ key: 'updateRule' })
  async updateRule(@messageData('id')id: number) {
    const rule = await this.cbStorage.getRuleById(id)

    if (!rule)
      this.createRule()
    else
      this.mountEditor(rule)
  }

  mountEditor(rule: Rule) {
    if (!this.appRoot)
      return

    this.ui = createApp(RulesEditor, { initialRule: rule, onCloseEditor: () => this.unmount() })
      .provide('saveRule', (rule: Rule) => {
        logInfo('saveRule', rule)
        this.testNodesList.revertAll()
        this.cbStorage.saveRule(rule)
      })
      .provide('highlightHideElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightHideElements(el)
      })
      .provide('highlightSearchElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightSearchElements(el)
      })
      .provide('testRule', (rule: Rule) => {
        logInfo('testRule', rule)
        this.testNodesList.revertAll()
        const nodes = this.rulesExecutor.getNodesForRule(rule)
        for (const node of nodes) {
          this.testNodesList.apply(node)
        }
      })
      .provide('shadowRoot', this.appRoot.parentNode)
      .provide('clearSelections', () => {
        this.elementsHighliter.clearAll()
        this.testNodesList.revertAll()
      })

    this.ui.mount(this.appRoot)
  }

  unmount() {
    this.ui?.unmount()
  }
}
