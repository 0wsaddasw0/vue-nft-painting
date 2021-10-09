import Vue from 'vue'
import VueRouter from 'vue-router'

import home from '@view/home.vue'
import openSource from '@view/openSource.vue'
import about from '@view/about.vue'
import art from '@view/art.vue'
import link from '@view/link.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    component: home
  },
  {
    path: '/opensource',
    name: 'opensource',
    component: openSource
  },
  {
    path: '/about',
    name: 'about',
    component: about
  },
  {
    path: '/art',
    name: 'art',
    component: art
  },
  {
    path: '/link',
    name: 'link',
    component: link
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
