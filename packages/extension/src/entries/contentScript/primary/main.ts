import { resolve } from 'deco-ext'
import { createApp } from 'vue'
import RulesExecutor from '~/services/rulesExecutor'
import renderContent from '../renderContent'
import Primary from './App.vue'
import './app.service'

(async () => {
  const rulesExecutor = await resolve(RulesExecutor)
  // this will read existing rules from storage and start executing it
  await rulesExecutor.init()
})()
