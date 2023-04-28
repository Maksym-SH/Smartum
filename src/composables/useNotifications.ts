import { watch, reactive, watchEffect, computed } from "vue";
import { INotificationDate, INotificationItem } from "@/interfaces";
import { useStore } from "vuex";
import { ObjectHasValues } from "@/helpers/methods";
import { NotifyAction } from "@/types";

const useNotifications = () => {
  const store = useStore();

  const notificationList: INotificationItem<INotificationDate | Date>[] = reactive([]); 

  const notificationsSize = computed(() => {
    return notificationList.length
  });

  const notifyAction = (id: number, action: NotifyAction): void => {
    const foundNotification = notificationList.find((notify) => notify.id === id);
    if (foundNotification) {
      switch(action) {
        case "readNotification":
          foundNotification.status = "read";
          break;
        case "deleteNotification": 
          const notificationIndex: number = notificationList
                                              .findIndex((item) => item === foundNotification);
          notificationList.splice(notificationIndex, 1);
          break;
        default: return
      }
    }
  }

  // Get all notifications.
  watchEffect(() => {
    const unicID = store.state.User.currentUser?.uid;
    if (unicID) {
      store.dispatch("getAllNotifications", unicID)
      .then((notifications) => {
        notificationList.push(...notifications.collection)
      })
    }
  })
  watch(() => store.state.Notifications.newNotification, (newNotification: INotificationItem<Date>): void => {
    if (ObjectHasValues(newNotification)) {
      notificationList.push(newNotification);
      store.commit("clearNewNotification");
    }
  })
  // Update database.
  watch(notificationList, (newValue) => {
    if (newValue) {
      store.dispatch("updateNotifications", {
        unicID: store.state.User.currentUser.uid,
        notifications: newValue
      })
    }
  })

  return {
    notificationsSize,
    notificationList,
    notifyAction
  }
}

export default useNotifications;