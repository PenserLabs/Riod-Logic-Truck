import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Truck from './views/Truck.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        guest: true
      }
    },
    {
      path: '/truck/:id',
      name: 'truck',
      component: Truck,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.auth) {
      next('/login');
    }
    else {
      next()
    }
  } else if(to.matched.some(record => record.meta.guest)) {
    if (store.state.auth) {
      next('/');
    }
    else {
      next()
    }
  }
})

export default router