import { AsideNavigationItems, ModalContentType } from "@/types";
import { IAsideNavigationItem } from "@/interfaces";
import { Links } from "@/enums";
import router from "@/router";
import store from "@/store";

export default function Navigation(): AsideNavigationItems {
  const Dashboard: IAsideNavigationItem = {
    id: 0,
    showed: true,
    alwaysDisplay: true,
    title: "Рабочие доски",
    icon: "view-dashboard",
    callback() {
      console.log("dashboard")
    }
  };

  const Configuration: IAsideNavigationItem = {
    id: 2,
    showed: true,
    alwaysDisplay: true,
    title: "Конфигурация",
    icon: "tune-vertical-variant",
    callback() {
      router.push({ name: "Configuration" })
    }
  };

  const Notification: IAsideNavigationItem = {
    id: 1,
    showed: true,
    title: "Уведомления",
    icon: "bell",
    notify: true,
    callback() {
      router.push({ name: "Notifications" })
    }
  };

  

  const Reports: IAsideNavigationItem = {
    id: 3,
    showed: true,
    title: "Отчёты",
    icon: "chart-timeline-variant",
    panels: [
      {
        title: "Отчёт об использовании",
        callback() {
          console.log("use report")
        }
      },
      {
        title: "Отчёт приложения",
        callback() {
          console.log("app report");
        }
      }
    ]
  };

  const Statistics: IAsideNavigationItem = {
    id: 4,
    showed: true,
    title: "Статистика",
    icon: "chart-bar",
    callback(): void {
      console.log("settings")
    }
  }

  const Author: IAsideNavigationItem = {
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

  const ConditionUse: IAsideNavigationItem = {
    id: 6,
    showed: true,
    title: "Об использовании",
    icon: "shield-alert",
    panels: [
      {
        title:"Пользовательское соглашение",
        callback(): void {
          console.log(store);
          const termsOfUse: ModalContentType = "termsOfUse";
          store.commit("setModalContentType", termsOfUse);
        }
      },
      {
        title: "Конфидециальность",
        callback(): void {
          const confidentiality: ModalContentType = "confidentiality";
          store.commit("setModalContentType", confidentiality);
        },
      }
    ]
  }

  return [
    Dashboard,
    Configuration,
    Notification,
    Statistics,
    Reports,
    ConditionUse,
    Author
  ]
}