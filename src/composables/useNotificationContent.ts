import { INotification } from "@/types/interfaces";
import { NotificationType, NotificationActionType } from "@/types/enums";

const useNewNotificationContent = (
  type: NotificationType,
  title?: string
): INotification<Date> | never => {
  let currentContent: Partial<INotification<Date>>;

  switch (type) {
    case NotificationType.WelcomeText:
      currentContent = {
        title: "Добро пожаловать в Smartum task management!",
        description:
          "Подтвердите свой электронный адрес, для подтверждения нажмите на это уведомление.",
        image: import.meta.env.BASE_URL + "images/notifyIcons/mail.svg",
        type: NotificationActionType.Verify,
      };
      break;
    case NotificationType.PasswordChange:
      currentContent = {
        title: "Изменения в безопасности аккаунта!",
        description:
          "Ваш пароль был изменен, если это были не вы, сбросьте пароль, нажав на это уведомление.",
        image: import.meta.env.BASE_URL + "images/notifyIcons/guard.svg",
        type: NotificationActionType.Reset,
      };
      break;
    case NotificationType.ConfigurationChange:
      currentContent = {
        title: "Изменения в навигации приложения!",
        description:
          "Некоторые элементы с приложения стали недоступны, если вам нужен доступ к скрытым частям приложения, пожалуйста активируйте их в пункте 'Конфигурация', вы можете перейти на страницу конфигурации, нажав на это уведомление.",
        image: import.meta.env.BASE_URL + "images/notifyIcons/settings.svg",
        type: NotificationActionType.Configuration,
      };
      break;
    case NotificationType.EmailConfirm:
      currentContent = {
        title: "Подтверждение адреса электронной почты",
        description: `Сообщение с инструкциями для подтверждения учётной записи было выслано вам на электронный адрес ${title}.`,
        status: "not read",
        image: import.meta.env.BASE_URL + "images/notifyIcons/mail.svg",
        type: NotificationActionType.Default,
      };
      break;
    case NotificationType.DashboardCreate:
      currentContent = {
        title: "Рабочее пространство",
        description: `Рабочая доска "${title}" была успешно создана, вы можете пригласить других участников в рабочее пространство!`,
        status: "not read",
        image: import.meta.env.BASE_URL + "images/notifyIcons/dashboard.jpg",
        type: NotificationActionType.Dashboard,
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
};

export default useNewNotificationContent;
