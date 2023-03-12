import { createRouter, createWebHistory } from 'vue-router'
// Refresh token
import RefreshToken from "@/helpers/firebase/firebaseRefresh";

const routes = [
  {
    name: "Login",
    path: "/login",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/EntryPage.vue")
  },
  {
    name: "Forgot",
    path: "/forgot-password",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/ForgotPasswordPage.vue")
  },
  {
    name: "Home",
    path: "/dashboard",
    meta: {
      protected: true,
    },
    component: () => import("@/views/Home.vue")
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  let requiresAuth: unknown = to.meta.protected;
  let token = localStorage.getItem('smartumToken');

  if (requiresAuth) {
    token ? next() : next("/login");
  } else {
    next();
  }
});

export default router
