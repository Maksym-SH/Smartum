import { watch, reactive, watchEffect, computed } from "vue";
import { IServerDate, INotification } from "@/interfaces";
import { ObjectHasValues } from "@/helpers/methods";
import { NotifyAction } from "@/types";
import { User } from "firebase/auth";

import useStores from "./useStores";
import useCurrentUserInfo from '@/composables/useCurrentUserInfo';

const useNotifications = () => {
  const { commonStore, notificationStore, userStore }  = useStores();

  const { unicID } = useCurrentUserInfo();

  const notificationList: INotification<IServerDate | Date>[] = reactive([]); 

  const notificationsSize = computed(() => {
    return notificationList.length
  });

  const clearAll = (): void => {
    notificationList.splice(0); // Clear all.
  }

  const notifyAction = (id: number, action: NotifyAction): void => {
    const foundNotification = notificationList.find((notify) => notify.id === id);
    if (foundNotification) {
      switch(action) {
        case "readNotification":
          foundNotification.status = "read";
          break;
        case "deleteNotification": 
          const notificationIndex: number = notificationList.findIndex((item) => item === foundNotification);
          notificationList.splice(notificationIndex, 1);
          break;
        default: return
      }
    }
  }

  // Get all notifications.
  watchEffect(() => {
    const unicID = (userStore.currentUser as User).uid;
    if (unicID && !ObjectHasValues(notificationList)) { // Get all if the list is initially empty.
      commonStore.setLoadingStatus(true);

      notificationStore.getAllNotifications(unicID)
      .then((notifications) => {
        notificationList.push(...notifications)
      })
      .finally(() => commonStore.setLoadingStatus(false))
    }
  })
  watch(() => notificationStore.newNotification, (newNotification): void => {
    if (ObjectHasValues(newNotification)) {
      notificationList.push(newNotification as INotification<IServerDate | Date>);
      notificationStore.clearNewNotification();
    }
  })

  // Update database.
  watch(notificationList, (newCollection) => {
    if (newCollection) {
      notificationStore.updateNotifications(newCollection, unicID.value)
    }
  })

  return {
    notificationsSize,
    notificationList,
    notifyAction,
    clearAll
  }
}

export default useNotifications;