import { createRouter, createWebHistory } from "vue-router";
import { Routes } from "@/types";

const routes: Routes = [
  {
    name: "SignIn",
    path: "/sign-in",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/SignInPage.vue"),
  },
  {
    name: "SignUp",
    path: "/sign-up",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/SignUpPage.vue"),
  },
  {
    name: "Forgot",
    path: "/forgot-password",
    meta: {
      free: true,
      notAuthorized: true,
    },
    component: () => import("@/views/ForgotPasswordPage.vue"),
  },
  {
    name: "Home",
    path: "/",
    meta: {
      protected: true,
    },
    component: () => import("@/views/HomePage.vue"),
    children: [
      {
        name: "Profile",
        path: "/profile",
        meta: {
          tabName: {
            eng: "Profile",
            ru: "Профиль",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/ProfileTab.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next): Promise<void> => {
  const token = localStorage.getItem("smartumToken");
  const protectedRoute = to.meta.protected;
  const notAuthorizedRoute = to.meta.notAuthorized;

  if (to.meta.protected || to.meta.free) {
    if (protectedRoute) {
      token ? next() : next({ name: "SignIn" });
    } 
    else {
      next();
    }
  } else if (notAuthorizedRoute && token) {
    next({ name: "Home" });
  } else next();
});

export default router;
