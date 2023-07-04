import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";

import { Route } from "@/types/enums";

const routes: Readonly<RouteRecordRaw[]> = [
  {
    name: Route.SIGN_IN,
    path: "/sign-in",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/SignInPage.vue"),
  },
  {
    name: Route.SIGN_UP,
    path: "/sign-up",
    meta: {
      notAuthorized: true,
    },
    component: () => import("@/views/SignUpPage.vue"),
  },
  {
    name: Route.FORGOT,
    path: "/forgot-password",
    meta: {
      free: true,
      notAuthorized: true,
    },
    component: () => import("@/views/ForgotPasswordPage.vue"),
  },
  {
    name: Route.HOME,
    path: "/",
    redirect: "/dashboard",
    meta: {
      protected: true,
    },
    component: () => import("@/views/HomePage.vue"),
    children: [
      {
        name: Route.PROFILE,
        path: "/profile",
        meta: {
          tabName: "Profile",
          protected: true,
        },
        component: () => import("@/views/tabs/ProfileTab.vue"),
      },
      {
        name: Route.NOTIFICATIONS,
        path: "/notifications",
        meta: {
          tabName: "Notifications",
          protected: true,
        },
        component: () => import("@/views/tabs/NotificationsTab.vue"),
      },
      {
        name: Route.REPORTS,
        path: "/reports",
        meta: {
          tabName: "Reports",
          protected: true,
        },
        component: () => import("@/views/tabs/ReportsTab.vue"),
      },
      {
        name: Route.CONFIGURATION,
        path: "/configuration",
        meta: {
          tabName: "Configuration",
          protected: true,
        },
        component: () => import("@/views/tabs/ConfigurationTab.vue"),
      },
      {
        name: Route.DASHBOARD,
        path: "/dashboard",
        meta: {
          tabName: "Dashboard",
          protected: true,
        },
        component: () => import("@/views/tabs/DashboardTab.vue"),
      },
    ],
  },
  {
    name: Route.BOARD,
    path: "/dashboards/board/:code",
    meta: {
      protected: true,
    },
    component: () => import("@/views/BoardPage.vue"),
  },
  {
    name: Route.NOT_FOUND,
    path: "/:pathMath(.*)",
    redirect: "/dashboard",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next): Promise<void> => {
  const { t } = i18n.global;

  const token = localStorage.getItem("smartumToken");
  const protectedRoute = to.meta.protected;
  const notAuthorizedRoute = to.meta.notAuthorized;

  if (to.meta.protected || to.meta.free) {
    if (protectedRoute) {
      if (token) {
        next();
      } else {
        next({ name: "SignIn" });
        notify({
          title: t("notify.sessionExpired.title"),
          text: t("notify.sessionExpired.text"),
        });
      }
    } else {
      next();
    }
  } else if (notAuthorizedRoute && token) {
    next({ name: "Home" });
  } else {
    next();
  }
});

export default router;
