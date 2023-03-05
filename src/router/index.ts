import { createRouter, createWebHistory } from 'vue-router'
import store from "@/store";
import { notify } from '@kyvg/vue3-notification';
const routes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("@/views/auth/index.vue")
  },
  {
    name: "Forgot",
    path: "/forgot-password",
    component: () => import("@/views/forgot/index.vue")
  },
/*   {
    name: "Dashboard",
    path: "/dashboard",
    component: () => import("@/views/")
  } */
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.protected) {
    if (store.getters.getUserToken) {
      next()
    } 
    else {
      next('/login');
      notify({
        title: "Срок вашей сессии истек, повторите вход."
      })
    }
  } else {
    next()
  }
})

export default router
