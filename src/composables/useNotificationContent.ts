import type { INotification, IWorkingBoardItem } from "@/types/interfaces";
import { NotificationActionType, NotificationType } from "@/types/enums";

export default function useNewNotificationContent(
  type: NotificationType,
  title?: string,
  info?: IWorkingBoardItem // | any smt else. ToDo.
): INotification<Date> | never {
  let currentContent: Partial<INotification<Date>>;
  
  switch (type) {
    case NotificationType.WelcomeText:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/mail.svg`,
        type: NotificationActionType.Verify,
        textType: NotificationType.WelcomeText,
      };
      break;
    case NotificationType.PasswordChange:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/guard.svg`,
        type: NotificationActionType.Reset,
        textType: NotificationType.PasswordChange,
      };
      break;
    case NotificationType.ConfigurationChange:
      currentContent = {
        image: `${import.meta.env.BASE_URL}images/notifyIcons/settings.svg`,
        type: NotificationActionType.Configuration,
        textType: NotificationType.ConfigurationChange,
      };
      break;
    case NotificationType.EmailConfirm:
      currentContent = {
        textParams: { title },
        status: "not read",
        image: `${import.meta.env.BASE_URL}images/notifyIcons/mail.svg`,
        type: NotificationActionType.Default,
        textType: NotificationType.EmailConfirm,
      };
      break;
    case NotificationType.DashboardCreate:
      currentContent = {
        textParams: { title },
        image: info?.background,
        type: NotificationActionType.Dashboard,
        textType: NotificationType.DashboardCreate,
      };
      break;
    case NotificationType.InviteToBoard:
      currentContent = {
        textParams: { title },
        image: info?.background,
        type: NotificationActionType.InviteToBoard,
        uid: info?.uid,
        joinCode: info?.joinCode,
        textType: NotificationType.InviteToBoard,
      };
      break;
    case NotificationType.SetAdmin:
      currentContent = {
        textParams: { title: info?.title },
        status: "not read",
        image: info?.background,
        type: NotificationActionType.Default,
        textType: NotificationType.SetAdmin,
      };
      break;
    default:
      throw new Error("Notification not supported.");
  }

  return {
    ...(currentContent as Required<INotification<Date>>),
    id: Date.now(),
    status: "not read",
    date: new Date(),
  };
}
