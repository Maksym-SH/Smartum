import { computed } from "vue";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import useStores from "./useStores";
import router from "@/router";

import type { IAsideNavItem } from "@/types/interfaces/components";
import { Links, Route, ModalContentType } from "@/types/enums";

export default function Navigation(): IAsideNavItem[] {
  const { t } = i18n.global;

  const { commonStore } = useStores();

  const DashboardTab: IAsideNavItem = {
    id: 0,
    showed: true,
    alwaysDisplay: true,
    title: computed(() => t("navigation.workBoards.title")),
    icon: "view-dashboard",
    callback() {
      router.push({ name: Route.DASHBOARD });
    },
  };

  const ConfigurationTab: IAsideNavItem = {
    id: 2,
    showed: true,
    alwaysDisplay: true,
    title: computed(() => t("navigation.configuration.title")),
    icon: "tune-vertical-variant",
    callback() {
      router.push({ name: Route.CONFIGURATION });
    },
  };

  const NotificationTab: IAsideNavItem = {
    id: 1,
    showed: true,
    title: computed(() => t("navigation.notifications.title")),
    icon: "bell",
    notify: true,
    callback() {
      router.push({ name: Route.NOTIFICATIONS });
    },
  };

  const ReportsTab: IAsideNavItem = {
    id: 3,
    showed: true,
    title: computed(() => t("navigation.reports.title")),
    icon: "chart-timeline-variant",
    panels: [
      {
        title: computed(() => t("navigation.reports.panels[0].title")),
        callback() {
          notify({
            title: t("notify.development.title"),
            type: "success",
          });
        },
      },
      {
        title: computed(() => t("navigation.reports.panels[1].title")),
        callback() {
          notify({
            title: t("notify.development.title"),
            type: "success",
          });
        },
      },
    ],
  };

  const StatisticsTab: IAsideNavItem = {
    id: 4,
    showed: true,
    title: computed(() => t("navigation.statistic.title")),
    icon: "chart-bar",
    callback(): void {
      notify({
        title: t("notify.development.title"),
        type: "success",
      });
    },
  };

  const AuthorTab: IAsideNavItem = {
    id: 5,
    showed: true,
    title: computed(() => t("navigation.contact.title")),
    icon: "message-bulleted",
    panels: [
      {
        title: computed(() => t("navigation.contact.panels[0].title")),
        callback(): void {
          window.open(Links.GIT_HUB_ACCOUNT, "_blank");
        },
      },
      {
        title: computed(() => t("navigation.contact.panels[1].title")),
        callback(): void {
          window.open(Links.TELEGRAM_ACCOUNT, "_blank");
        },
      },
    ],
  };

  const ConditionUseTab: IAsideNavItem = {
    id: 6,
    showed: true,
    title: computed(() => t("navigation.usage.title")),
    icon: "shield-alert",
    panels: [
      {
        title: computed(() => t("navigation.usage.panels[0].title")),
        callback(): void {
          commonStore.setModalContentType(ModalContentType.TERMS_OF_USE);
        },
      },
      {
        title: computed(() => t("navigation.usage.panels[1].title")),
        callback(): void {
          commonStore.setModalContentType(ModalContentType.CONFIDENTIALITY);
        },
      },
    ],
  };

  return [
    DashboardTab,
    ConfigurationTab,
    NotificationTab,
    StatisticsTab,
    ReportsTab,
    ConditionUseTab,
    AuthorTab,
  ];
}
