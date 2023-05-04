import { createRouter, createWebHashHistory } from "vue-router";
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
    redirect: "/dashboard",
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
      {
        name: "Notifications",
        path: "/notifications",
        meta: {
          tabName: {
            eng: "Notifications",
            ru: "Уведомления",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/NotificationsTab.vue"),
      },
      {
        name: "Reports",
        path: "/reports",
        meta: {
          tabName: {
            eng: "Reports",
            ru: "Отчеты",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/ReportsTab.vue"),
      },
      {
        name: "Configuration",
        path: "/configuration",
        meta: {
          tabName: {
            eng: "Configuration",
            ru: "Конфигурация",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/ConfigurationTab.vue"),
      },
      {
        name: "Configuration",
        path: "/configuration",
        meta: {
          tabName: {
            eng: "Configuration",
            ru: "Конфигурация",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/ConfigurationTab.vue"),
      },
      {
        name: "Dashboard",
        path: "/dashboard",
        meta: {
          tabName: {
            eng: "Dashboard",
            ru: "Рабочие доски",
          },
          protected: true,
        },
        component: () => import("@/views/tabs/DashboardTab.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to, _, next): Promise<void> => {
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
