import Vue from 'vue'
import VueRouter from 'vue-router'
import { Role } from "@/lib/UserRole";

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
    props: true, // for query params
    component: () => import('../views/LoginView.vue'),
    meta: {
      auth: false,
      title: 'Login'
    }
  },
  {
    path: '/map',
    name: 'map',
    props: true, // for query params
    component: () => import('../views/MapView.vue'),
    meta: {
      auth: true,
      title: 'Karte',
      visibleFor: Role.Basis
    }
  },
  {
    path: '/jokers',
    name: 'jokers',
    props: true, // for query params
    component: () => import('../views/teams/JokersView.vue'),
    meta: {
      auth: true,
      title: 'Jokers',
      visibleFor: Role.Joker

    }
  },
  {
    path: '/challange',
    name: 'solveChallange',
    props: true, // for query params
    component: () => import('../views/teams/SolveChallangeView.vue'),
    meta: {
      auth: true,
      title: 'Challange lösen',
      visibleFor: Role.SuperAdmin
    }
  },
  {
    path: '/stations',
    name: 'submitStations',
    props: true, // for query params
    component: () => import('../views/teams/SubmitStationView.vue'),
    meta: {
      auth: true,
      title: 'Stationen',
      visibleFor: (Role.Joker | Role.Basis)
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

  if (to.meta.auth === false) {
    next()
    return
  }

  if (!localStorage.getItem("authToken")) {
    next({
      path: '/login',
      query: { returnUrl: to.fullPath }
    })
    return
  }

  next()
})

export default router
