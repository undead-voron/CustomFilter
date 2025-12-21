import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/tutorial',
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('./components/HelpEn.vue'),
    },
    {
      path: '/word-groups',
      name: 'wordGroups',
      component: () => import('./components/WordGroups.vue'),
    },
  ],
})

export default router 