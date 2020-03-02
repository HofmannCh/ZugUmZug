import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

import App from './App.vue'
import router from './router'

import "bootstrap"

Vue.config.productionTip = false

import store from "@/stores";

new Vue({
  router,
  store,
  render: render => render(App)
}).$mount('#app')
