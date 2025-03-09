import { resolve } from 'deco-ext'
import RulesExecutor from '~/services/rulesExecutor'
import './app.service'

(async () => {
  const rulesExecutor = await resolve(RulesExecutor)
  // this will read existing rules from storage and start executing it
  await rulesExecutor.init()
})()
