import '@babel/polyfill'
import 'mutationobserver-shim'

import "jquery"

import Vue from 'vue'

// Fucking ugly, but I didn't found better solution
import moment from 'moment'
Vue.prototype.moment = moment;
(Window.prototype as any).moment = moment;

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

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
  router,
  duration: 2000,
  keepOnHover: true,
})