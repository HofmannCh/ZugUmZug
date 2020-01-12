import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import "./custom.sass"

import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

import axios from "axios";
axios.defaults.baseURL = process.env.API_BASE_URL;
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';

import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('authToken') || '',
    user: {}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
      state.token = ''
      state.user = ''
      localStorage.removeItem('token')
    },
    logout(state) {
      state.status = ''
      state.token = ''
    }
  },
  actions: {
    login({ commit }, { userName, password }) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post("https://api-zuz.hofi.dev/"+"auth/login", { UserName: userName, Password: password })
          .then(resp => {
            const token = resp.data.Token
            const user = resp.data.User
            localStorage.setItem('authToken', token)
            axios.defaults.headers.common['Authorization'] = token
            commit('auth_success', { token, user })
            resolve(resp)
          })
          .catch(err => {
            commit('auth_error')
            reject(err)
          })
      })
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  }
})

new Vue({
  router,
  store,
  render: render => render(App)
}).$mount('#app')
