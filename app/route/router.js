import Vue from 'vue'
import VueRouter from 'vue-router'

import home from '@view/home.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    component: home
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
