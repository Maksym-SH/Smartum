import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    name: "SignIn",
    path: "/sign-in",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/SignInPage.vue")
  },
  {
    name: "SignUp",
    path: "/sign-up",
    meta: {
      notAuthorized: true
    },
    component: () => import ("@/views/SignUpPage.vue")
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
      token ? next() : next("/sign-in");
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
