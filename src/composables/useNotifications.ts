import { computed, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";
import type { INotificationList } from "@/types/types";

import useStores from "./useStores";
import useCurrentUserInfo from "./useCurrentUserInfo";
import { ArrayHasValues } from "@/helpers/methods";

function useNotifications() {
  const { notificationStore, commonStore } = useStores();

  const { unicID } = useCurrentUserInfo();

  const { allNotifications } = storeToRefs(notificationStore);

  const notificationsSize = computed((): number => {
    return allNotifications.value.length;
  });

  // Get all notifications.
  onBeforeMount(() => {
    if (!ArrayHasValues(allNotifications.value)) {
      // Get all if the list is initially empty.
      commonStore.setLoadingStatus(true);
      notificationStore
        .getAllNotifications(unicID.value)
        .then((notifications: INotificationList) => {
          notificationStore.setAllNotification(notifications);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    }
  });

  return {
    notificationsSize,
    allNotifications,
  };
}

export default useNotifications;
