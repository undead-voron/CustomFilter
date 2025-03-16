import { resolve } from 'deco-ext'
import RulesExecutor from '~/entries/contentScript/services/rulesExecutor'
import './services/app.service.ts'

(async () => {
  const rulesExecutor = await resolve(RulesExecutor)
  // this will read existing rules from storage and start executing it
  await rulesExecutor.init()
})()
