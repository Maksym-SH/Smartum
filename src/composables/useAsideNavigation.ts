import { computed } from "vue";
import { notify } from "@kyvg/vue3-notification";
import type { AsideNavigationItems, ModalContentType } from "@/types/types";
import type { IAsideNavigationItem } from "@/types/interfaces";
import { Links } from "@/types/enums";

import i18n from "@/i18n";
import useStores from "./useStores";
import router from "@/router";

export default function Navigation(): AsideNavigationItems {
  const { t } = i18n.global;

  const { commonStore } = useStores();

  const DashboardTab: IAsideNavigationItem = {
    id: 0,
    showed: true,
    alwaysDisplay: true,
    title: computed(() => t("navigation.workBoards.title")),
    icon: "view-dashboard",
    callback() {
      router.push({ name: "Dashboard" });
    },
  };

  const ConfigurationTab: IAsideNavigationItem = {
    id: 2,
    showed: true,
    alwaysDisplay: true,
    title: computed(() => t("navigation.configuration.title")),
    icon: "tune-vertical-variant",
    callback() {
      router.push({ name: "Configuration" });
    },
  };

  const NotificationTab: IAsideNavigationItem = {
    id: 1,
    showed: true,
    title: computed(() => t("navigation.notifications.title")),
    icon: "bell",
    notify: true,
    callback() {
      router.push({ name: "Notifications" });
    },
  };

  const ReportsTab: IAsideNavigationItem = {
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

  const StatisticsTab: IAsideNavigationItem = {
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

  const AuthorTab: IAsideNavigationItem = {
    id: 5,
    showed: true,
    title: computed(() => t("navigation.contact.title")),
    icon: "message-bulleted",
    panels: [
      {
        title: computed(() => t("navigation.contact.panels[0].title")),
        callback(): void {
          window.open(Links.GitHubAccount, "_blank");
        },
      },
      {
        title: computed(() => t("navigation.contact.panels[1].title")),
        callback(): void {
          window.open(Links.TelegramAccount, "_blank");
        },
      },
    ],
  };

  const ConditionUseTab: IAsideNavigationItem = {
    id: 6,
    showed: true,
    title: computed(() => t("navigation.usage.title")),
    icon: "shield-alert",
    panels: [
      {
        title: computed(() => t("navigation.usage.panels[0].title")),
        callback(): void {
          const termsOfUse: ModalContentType = "termsOfUse";
          commonStore.setModalContentType(termsOfUse);
        },
      },
      {
        title: computed(() => t("navigation.usage.panels[1].title")),
        callback(): void {
          const confidentiality: ModalContentType = "confidentiality";
          commonStore.setModalContentType(confidentiality);
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
