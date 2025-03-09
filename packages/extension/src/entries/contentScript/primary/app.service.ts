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
        this.cbStorage.saveRule(rule)
      })
      .provide('highlightHideElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightHideElements(el)
      })
      .provide('highlightSearchElements', (el?: HTMLElement[]) => {
        this.elementsHighliter.highlightSearchElements(el)
      })
      .provide('testRule', (rule: Rule) => {
        this.rulesExecutor.rules.push(rule)
        this.rulesExecutor.applyRule(rule, true, (node: HTMLElement) => { 
          this.testNodesList.add(node)
          this.testNodesList.apply(node)
        }, true)
        this.rulesExecutor.execBlock()
      })
      .provide('shadowRoot', this.appRoot.parentNode);

    this.ui.mount(this.appRoot)
  }

  mount() {
    if (!this.appRoot)
      return

    // TODO: handle it. Find out how app opens ui
    // this.ui.mount(this.appRoot)
    const props = this.cbStorage.createRule()
    this.ui = createApp(RulesEditor, { initialRule: props, onCloseEditor: () => this.unmount() })
      .provide('saveRule', (rule: Rule) => {
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
        this.rulesExecutor.rules.push(rule)
        this.rulesExecutor.applyRule(rule, true, (node: HTMLElement) => { 
          console.log('callback args', node)
          this.testNodesList.add(node)
          this.testNodesList.apply(node)
        }, true)
        this.rulesExecutor.execBlock()
      })
      .provide('shadowRoot', this.appRoot.parentNode);

    this.ui.mount(this.appRoot)
  }

  unmount() {
    this.ui?.unmount()
  }
}
