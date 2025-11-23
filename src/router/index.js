import { createRouter, createWebHistory } from 'vue-router'

// Route guard to check authentication
const requireAuth = (to, from, next) => {
  const user = localStorage.getItem('cobunny_user')
  if (user) {
    next()
  } else {
    next({ name: 'sign-in' })
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/browse',
    name: 'browse',
    component: () => import('../views/Browse.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/space/:id',
    name: 'space-details',
    component: () => import('../views/SpaceDetails.vue'),
    props: true
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { requiresAuth: true },
    beforeEnter: requireAuth
  },
  {
    path: '/booking/create/:spaceId',
    name: 'create-booking',
    component: () => import('../views/CreateBooking.vue'),
    meta: { requiresAuth: true },
    beforeEnter: requireAuth,
    props: true
  },
  {
    path: '/booking/view/:id',
    name: 'view-booking',
    component: () => import('../views/ViewBooking.vue'),
    meta: { requiresAuth: true },
    beforeEnter: requireAuth,
    props: true
  },
  {
    path: '/booking/edit/:id',
    name: 'edit-booking',
    component: () => import('../views/EditBooking.vue'),
    meta: { requiresAuth: true },
    beforeEnter: requireAuth,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router