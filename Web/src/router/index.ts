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
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: {
      auth: false,
      title: 'Login'
    }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: "history",
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title + " | Zug um Zug" : 'Zug um Zug'

  if(to.meta.auth == false){
    next()
    return
  }

  if (!localStorage.getItem("authToken")) {
    next({
      path: '/login',
      params: { nextUrl: to.fullPath }
    })
    return
  }

  next()
})

export default router
