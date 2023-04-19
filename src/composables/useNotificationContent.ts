import { INotificationItem } from "@/interfaces";
import { NotifcationType, NotifyType } from "@/enums";

const useNewNotificationContent = (type: NotifcationType, ): INotificationItem<Date> | never => {
  let currentContent: Partial<INotificationItem<Date>>;

  switch(type) {
    case NotifcationType.Welcome:
      currentContent = {
        title: "Добро пожаловать в Smartum task management!",
        description: "Подтвердите свой электронный адрес, для подтверждения нажмите на это уведомление.",
        status: "not read",
        image: process.env.BASE_URL + "notifyIcons/mail.svg",
        type: NotifyType.Profile
      }
      break;
    case NotifcationType.PasswordChange:
      currentContent = {
        title: "Изменения в безопасности аккаунта!",
        description: "Ваш пароль был изменен, если это были не вы, сбросьте пароль, нажав на это уведомление.",
        status: "not read",
        image: process.env.BASE_URL + "notifyIcons/guard.svg",
        type: NotifyType.Reset
      }
      break;
    // ToDo ...
    default: throw new Error("Notification not supported.")
  }

  return {
    ...currentContent as Required<INotificationItem<Date>>,
    id: Date.now(),
    date: new Date()
  }
}

export default useNewNotificationContent;