import { AsideNavigationItems, ModalContentType } from "@/types";
import { IAsideNavigationItem } from "@/interfaces";
import { Links } from "@/enums";
import { notify } from "@kyvg/vue3-notification";

import router from "@/router";
import useStores from "./useStores";

export default function Navigation(): AsideNavigationItems {
  const { commonStore } = useStores();

  const DashboardTab: IAsideNavigationItem = {
    id: 0,
    showed: true,
    alwaysDisplay: true,
    title: "Рабочие доски",
    icon: "view-dashboard",
    callback() {
      router.push({ name: "Dashboard" })
    }
  };

  const ConfigurationTab: IAsideNavigationItem = {
    id: 2,
    showed: true,
    alwaysDisplay: true,
    title: "Конфигурация",
    icon: "tune-vertical-variant",
    callback() {
      router.push({ name: "Configuration" })
    }
  };

  const NotificationTab: IAsideNavigationItem = {
    id: 1,
    showed: true,
    title: "Уведомления",
    icon: "bell",
    notify: true,
    callback() {
      router.push({ name: "Notifications" })
    }
  };

  const ReportsTab: IAsideNavigationItem = {
    id: 3,
    showed: true,
    title: "Отчёты",
    icon: "chart-timeline-variant",
    panels: [
      {
        title: "Отчёт об использовании",
        callback() {
          notify({
            title: "Страница в разработке!",
            type: "success"
          })
        }
      },
      {
        title: "Отчёт приложения",
        callback() {
          notify({
            title: "Страница в разработке!",
            type: "success"
          })
        }
      }
    ]
  };

  const StatisticsTab: IAsideNavigationItem = {
    id: 4,
    showed: true,
    title: "Статистика",
    icon: "chart-bar",
    callback(): void {
      notify({
        title: "Страница в разработке!",
        type: "success"
      })
    }
  }

  const AuthorTab: IAsideNavigationItem = {
    id: 5,
    showed: true,
    title: "Связь с автором",
    icon: "message-bulleted",
    panels: [
      {
        title: "GitHub",
        callback(): void {
          window.open(Links.GitHubAccount, "_blank");
        },
      },
      {
        title: "Telegram",
        callback(): void {
          window.open(Links.TelegramAccount, "_blank");
        }
      }
    ]
  }

  const ConditionUseTab: IAsideNavigationItem = {
    id: 6,
    showed: true,
    title: "Об использовании",
    icon: "shield-alert",
    panels: [
      {
        title:"Пользовательское соглашение",
        callback(): void {
          const termsOfUse: ModalContentType = "termsOfUse";
          commonStore.setModalContentType(termsOfUse);
        }
      },
      {
        title: "Конфидециальность",
        callback(): void {
          const confidentiality: ModalContentType = "confidentiality";
          commonStore.setModalContentType(confidentiality);
        },
      }
    ]
  }

  return [
    DashboardTab,
    ConfigurationTab,
    NotificationTab,
    StatisticsTab,
    ReportsTab,
    ConditionUseTab,
    AuthorTab
  ]
}