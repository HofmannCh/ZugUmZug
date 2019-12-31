import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      auth: false,
      title: 'Startseite'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      auth: true,
      title: 'Über'
    }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: "history",
  routes
})

export default router
