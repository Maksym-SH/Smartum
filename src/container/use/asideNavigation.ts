import { AsideNavigationItems, ModalContentType } from "@/types";
import { IAsideNavigationItemParams } from "@/interfaces";
import { Links } from "@/enums";
import router from "@/router";
import { useStore } from "vuex";

export default function Navigation(): AsideNavigationItems {
  const store = useStore();

  const Dashboard: IAsideNavigationItemParams = {
    title: "Рабочие доски",
    icon: "view-dashboard",
    callback() {
      console.log("dashboard")
    }
  };

  const Notification: IAsideNavigationItemParams = {
    title: "Уведомления",
    icon: "bell",
    notify: true,
    callback() {
      router.push({ name: "Notifications" })
    }
  };

  const Configuration: IAsideNavigationItemParams = {
    title: "Конфигурация",
    icon: "tune-vertical-variant",
    callback() {
      console.log("settings")
    }
  };

  const Reports: IAsideNavigationItemParams = {
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

  const Statistics: IAsideNavigationItemParams = {
    title: "Статистика",
    icon: "chart-bar",
    callback(): void {
      console.log("settings")
    }
  }

  const Author: IAsideNavigationItemParams = {
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

  const ConditionUse: IAsideNavigationItemParams = {
    title: "Об использовании",
    icon: "shield-alert",
    panels: [
      {
        title:"Пользовательское соглашение",
        callback(): void {
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
    Notification,
    Configuration,
    Statistics,
    Reports,
    ConditionUse,
    Author
  ]
}