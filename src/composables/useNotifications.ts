import { computed, onBeforeMount } from "vue";
import { storeToRefs } from "pinia";

import useStores from "./useStores";
import useCurrentUserInfo from "./useCurrentUserInfo";
import { ArrayHasValues } from "@/helpers/methods";

function useNotifications() {
  const { notificationStore, commonStore } = useStores();

  const { unicID } = useCurrentUserInfo();

  const { allNotifications } = storeToRefs(notificationStore);

  const notificationsSize = computed((): number => {
    return allNotifications.value.filter(
      (notification) => notification.status === "not read"
    ).length;
  });

  // Get all notifications.
  onBeforeMount(() => {
    if (!ArrayHasValues(allNotifications.value)) {
      // Get all if the list is initially empty.
      commonStore.setLoadingStatus(true);
      notificationStore
        .getAllNotifications(unicID.value, true)
        .finally(() => commonStore.setLoadingStatus(false));
    }
  });

  return {
    notificationsSize,
    allNotifications,
  };
}

export default useNotifications;
