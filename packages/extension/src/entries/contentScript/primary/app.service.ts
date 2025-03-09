import { InjectableService, messageData, onMessage } from 'deco-ext'
import { type App, createApp } from 'vue'
import RulesEditor from '~/entries/contentScript/components/RuleEditor.vue'
import ElementHighlighter from '~/services/elementsHighlighter'
import RulesExecutor from '~/services/rulesExecutor'
import RulesSevice from '~/services/storage'
import { Rule } from '~/services/types'
import renderContent from '../renderContent'
import { TestNodes } from '~/services/stylesController'
@InjectableService()
export default class Main {
  ui?: App
  appRoot?: HTMLElement
  constructor(
    protected rulesExecutor: RulesExecutor,
    protected elementsHighliter: ElementHighlighter,
    protected cbStorage: RulesSevice,
    protected testNodesList: TestNodes,
  ) {}

  async init() {
    renderContent(
      import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      (appRoot: HTMLElement) => {
        this.appRoot = appRoot
      },
    )
  }

  @onMessage({ name: 'createRule' })
  createRule() {
    const rule = this.cbStorage.createRule()
    this.mountEditor(rule)
  }

  @onMessage({ name: 'updateRule' })
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
        console.log('testing rule', rule)
        this.testNodesList.revertAll()
        const nodes = this.rulesExecutor.getNodesForRule(rule)
        for (const node of nodes) {
          this.testNodesList.apply(node)
        }
      })
      .provide('shadowRoot', this.appRoot.parentNode);

    this.ui.mount(this.appRoot)
  }

  unmount() {
    this.ui?.unmount()
  }
}
