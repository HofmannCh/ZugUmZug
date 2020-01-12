import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import "./custom.sass"

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: render => render(App),
  watch: {
    '$route' (to, from) {
      document.title = to.meta.title ? to.meta.title + " | Zug um Zug" : 'Zug um Zug'
    }
  }
}).$mount('#app')
