import { createRouter, createWebHistory } from 'vue-router'

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

router.beforeEach(async(to, from, next) => {
  const token = localStorage.getItem('smartumToken');
  const protectedRoute = to.meta.protected;
  const notAuthorizedRoute = to.meta.notAuthorized;

  if(to.meta.protected) {
    if (protectedRoute) {
      token ? next() : next("/login");
    } else {
      next();
    }
  }
  else if(notAuthorizedRoute && token) {
    next("/dashboard")
  }
  else next();
});

export default router
