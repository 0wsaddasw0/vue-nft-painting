import Vue from 'vue'
import App from './App.vue'
import router from './route/router.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import commonFunction from '@util/commonFunction.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.prototype.$CF=commonFunction;
Vue.use(ElementUI)
Vue.prototype.$axios = axios
Vue.use(VueAxios,axios)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
