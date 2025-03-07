import { InjectableService, onMessage } from 'deco-ext'
import { type App, createApp } from 'vue'
import RulesEditor from '~/entries/contentScript/components/RuleEditor.vue'
import ElementHighlighter from '~/services/elementsHighlighter'
import RulesExecutor from '~/services/rulesExecutor'
import RulesSevice from '~/services/storage'
import { Rule } from '~/services/types'
import renderContent from '../renderContent'

@InjectableService()
export default class Main {
  ui?: App
  appRoot?: HTMLElement
  constructor(
    protected rulesExecutor: RulesExecutor,
    protected elementsHighliter: ElementHighlighter,
    protected cbStorage: RulesSevice,
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
          .provide('shadowRoot', this.appRoot.parentNode)
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
    createApp(RulesEditor, { initialRule: props })
      .provide('saveRule', (rule: Rule) => {
        this.cbStorage.saveRule(rule)
      })
      .provide('highlightHideElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightHideElements(el)
      })
      .provide('highlightSearchElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightSearchElements(el)
      })
      .provide('applyRule', (rule: Rule) => {
        console.log('applying rule', rule)
        this.rulesExecutor.rules.push(rule)
        // this.rulesExecutor.applyRule(rule, true, (...args) => { console.log('callback args', args) }, false)
        this.rulesExecutor.execBlock()
      })
      .provide('shadowRoot', this.appRoot.parentNode)
      .mount(this.appRoot)
  }

  unmount() {
    this.ui?.unmount()
  }
}
