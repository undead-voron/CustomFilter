import { InjectableService, onMessage } from 'deco-ext'
import { type App, createApp } from 'vue'
import RulesEditor from '~/entries/contentScript/components/RuleEditor.vue'
import ElementHighlighter from '~/services/elementsHighlighter'
import RulesExecutor from '~/services/rulesExecutor'
import CustomBlockerStorage from '~/services/storage'
import { Rule } from '~/services/types'
import renderContent from '../renderContent'

@InjectableService()
export default class Main {
  ui?: App
  appRoot?: HTMLElement
  constructor(
    protected rulesExecutor: RulesExecutor,
    protected elementsHighliter: ElementHighlighter,
    protected cbStorage: CustomBlockerStorage,
  ) {}

  async init() {
    renderContent(
      import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      (appRoot: HTMLElement) => {
        this.appRoot = appRoot
        this.ui = createApp(RulesEditor)
        this.ui.provide('applyRule', (rule: Rule) => {
          this.rulesExecutor.applyRule(rule, true, (node) => {
            this.elementsHighliter.highlightHideElements([node])
          }, false)
        })
          .provide('saveRule', (rule: Rule) => {
            this.cbStorage.saveRule(rule)
          })
          .provide('highlightHideElements', (el?: HTMLElement[]) => {
            this.elementsHighliter.highlightHideElements(el)
          })
          .provide('highlightSearchElements', (el?: HTMLElement[]) => {
            this.elementsHighliter.highlightSearchElements(el)
          })
      },
    )
  }

  @onMessage({ name: 'openRuleEditor' })
  mount() {
    if (!this.appRoot)
      return

    // TODO: handle it. Find out how app opens ui
    // this.ui.mount(this.appRoot)
    const props = this.cbStorage.createRule()
    createApp(RulesEditor, { initialRule: props }).mount(this.appRoot)
  }

  unmount() {
    this.ui?.unmount()
  }
}
