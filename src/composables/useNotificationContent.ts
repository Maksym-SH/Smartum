import type { IWorkingBoardItem } from "@/types/interfaces/board";
import type { INotification } from "@/types/interfaces/components";
import { NotificationAction, NotificationStatus, NotificationType } from "@/types/enums";

export default function useNewNotificationContent(
  type: NotificationType,
  title?: string,
  info?: IWorkingBoardItem // | any smt else. ToDo.
): INotification<Date> | never {
  let currentContent: Partial<INotification<Date>>;

  switch (type) {
    case NotificationType.WELCOME_TEXT:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/mail.svg`,
        type: NotificationAction.VERIFY,
        textType: NotificationType.WELCOME_TEXT,
      };
      break;
    case NotificationType.PASSWORD_CHANGE:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/guard.svg`,
        type: NotificationAction.RESET,
        textType: NotificationType.PASSWORD_CHANGE,
      };
      break;
    case NotificationType.CONFIGURATION_CHANGE:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/settings.svg`,
        type: NotificationAction.CONFIGURATION,
        textType: NotificationType.CONFIGURATION_CHANGE,
      };
      break;
    case NotificationType.EMAIL_CONFIRM:
      currentContent = {
        textParams: { title },
        image: `${import.meta.env.BASE_URL}images/notifyIcons/mail.svg`,
        type: NotificationAction.DEFAULT,
        textType: NotificationType.EMAIL_CONFIRM,
      };
      break;
    case NotificationType.BOARD_CREATED:
      currentContent = {
        textParams: { title },
        image: info?.background,
        type: NotificationAction.DASHBOARD,
        textType: NotificationType.BOARD_CREATED,
      };
      break;
    case NotificationType.INVITE_TO_BOARD:
      currentContent = {
        textParams: { title },
        image: info?.background,
        type: NotificationAction.INVITE_TO_BOARD,
        uid: info?.uid,
        joinCode: info?.joinCode,
        textType: NotificationType.INVITE_TO_BOARD,
      };
      break;
    case NotificationType.SET_ADMIN:
      currentContent = {
        textParams: { title: info?.title },
        image: info?.background,
        type: NotificationAction.DEFAULT,
        textType: NotificationType.SET_ADMIN,
      };
      break;
    default:
      throw new Error("Notification not supported.");
  }

  return {
    ...(currentContent as Required<INotification<Date>>),
    id: Date.now(),
    status: NotificationStatus.NOT_READ,
    date: new Date(),
  };
}
