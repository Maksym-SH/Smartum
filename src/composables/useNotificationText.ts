import { computed } from "vue";

import i18n from "@/i18n";

import { NotificationType } from "@/types/enums";
import type { INotificationContent } from "@/types";
import type { INotification } from "@/types/interfaces/components";

export default function useNewNotificationTranslatedContent(
  notification: INotification
): INotificationContent | never {
  const { t } = i18n.global;

  let notificationText: INotificationContent;

  const paramTitle = notification?.textParams?.title;

  switch (notification.textType) {
    case NotificationType.WELCOME_TEXT:
      notificationText = {
        title: computed(() => t("notifications.welcome.title")),
        description: computed(() => t("notifications.welcome.description")),
      };
      break;
    case NotificationType.PASSWORD_CHANGE:
      notificationText = {
        title: computed(() => t("notifications.passwordChange.title")),
        description: computed(() => t("notifications.passwordChange.description")),
      };
      break;
    case NotificationType.CONFIGURATION_CHANGE:
      notificationText = {
        title: computed(() => t("notifications.configurationChange.title")),
        description: computed(() => t("notifications.configurationChange.description")),
      };
      break;
    case NotificationType.EMAIL_CONFIRM:
      notificationText = {
        title: computed(() => t("notifications.emailConfirm.title")),
        description: computed(() =>
          t("notifications.emailConfirm.description", {
            title: paramTitle,
          })
        ),
      };
      break;
    case NotificationType.BOARD_CREATED:
      notificationText = {
        title: computed(() => t("notifications.dashboardCreate.title")),
        description: computed(() =>
          t("notifications.dashboardCreate.description", {
            title: paramTitle,
          })
        ),
      };
      break;
    case NotificationType.INVITE_TO_BOARD:
      notificationText = {
        title: computed(() => t("notifications.inviteToBoard.title")),
        description: computed(() =>
          t("notifications.inviteToBoard.description", { title: paramTitle })
        ),
      };
      break;
    case NotificationType.SET_ADMIN:
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
