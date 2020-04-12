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
      auth: false,
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
      visibleFor: Role.Basis | Role.Admin
    }
  },
  {
    path: '/challenge',
    name: 'solveChallenge',
    props: true, // for query params
    component: () => import('../views/teams/SolveChallengeView.vue'),
    meta: {
      auth: true,
      title: 'Challenge lösen',
      visibleFor: Role.Group
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
      visibleFor: Role.Group
    }
  },
  // Manage / Masterdata
  {
    path: '/manage/jokers',
    name: 'manageJokers',
    props: true, // for query params
    component: () => import('../views/manage/JokersView.vue'),
    meta: {
      auth: true,
      title: 'Jokers',
      visibleFor: Role.Joker | Role.Basis | Role.Admin

    }
  },
  {
    path: '/manage/challenges',
    name: 'manageChallenge',
    props: true, // for query params
    component: () => import('../views/manage/ChallengesView.vue'),
    meta: {
      auth: true,
      title: 'Challenges',
      visibleFor: Role.Basis | Role.Admin

    }
  },
  {
    path: '/manage/groups',
    name: 'manageGroups',
    props: true, // for query params
    component: () => import('../views/manage/GroupsView.vue'),
    meta: {
      auth: true,
      title: 'Gruppen',
      visibleFor: Role.Admin
    }
  },
  {
    path: '/manage/users',
    name: 'manageUsers',
    props: true, // for query params
    component: () => import('../views/manage/UsersView.vue'),
    meta: {
      auth: true,
      title: 'Accounts',
      visibleFor: Role.Admin
    }
  },
  {
    path: '/manage/events',
    name: 'manageEvents',
    props: true, // for query params
    component: () => import('../views/manage/JokersView.vue'),
    meta: {
      auth: true,
      title: 'Events',
      visibleFor: Role.SuperAdmin
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
    });
    return
  }

  next();
})

export default router
