import { computed } from "vue";
import type { INotification, INotificationContent } from "@/types/interfaces";
import { NotificationType } from "@/types/enums";

import i18n from "@/i18n";

export default function useNewNotificationTranslatedContent(
  notification: INotification
): INotificationContent | never {
  const { t } = i18n.global;

  let notificationText: INotificationContent;

  const paramTitle = notification?.textParams?.title;

  switch (notification.textType) {
    case NotificationType.WelcomeText:
      notificationText = {
        title: computed(() => t("notifications.welcome.title")),
        description: computed(() => t("notifications.welcome.description")),
      };
      break;
    case NotificationType.PasswordChange:
      notificationText = {
        title: computed(() => t("notifications.passwordChange.title")),
        description: computed(() => t("notifications.passwordChange.description")),
      };
      break;
    case NotificationType.ConfigurationChange:
      notificationText = {
        title: computed(() => t("notifications.configurationChange.title")),
        description: computed(() => t("notifications.configurationChange.description")),
      };
      break;
    case NotificationType.EmailConfirm:
      notificationText = {
        title: computed(() => t("notifications.emailConfirm.title")),
        description: computed(() =>
          t("notifications.emailConfirm.description", {
            title: paramTitle,
          })
        ),
      };
      break;
    case NotificationType.DashboardCreate:
      notificationText = {
        title: computed(() => t("notifications.dashboardCreate.title")),
        description: computed(() =>
          t("notifications.dashboardCreate.description", {
            title: paramTitle,
          })
        ),
      };
      break;
    case NotificationType.InviteToBoard:
      notificationText = {
        title: computed(() => t("notifications.inviteToBoard.title")),
        description: computed(() =>
          t("notifications.inviteToBoard.description", { title: paramTitle })
        ),
      };
      break;
    case NotificationType.SetAdmin:
      notificationText = {
        title: computed(() => t("notifications.setAdmin.title")),
        description: computed(() =>
          t("notifications.setAdmin.description", {
            fromBoard: paramTitle,
          })
        ),
      };
      break;
    default:
      throw new Error("Notification content is not supported.");
  }

  return notificationText;
}
