import { computed, watch } from 'vue'
import type { User } from 'firebase/auth'
import { storeToRefs } from 'pinia'
import useStores from './useStores'
import type { INotificationList } from '@/types/types'

function useNotifications() {
  const { notificationStore, userStore } = useStores()

  const { allNotifications } = storeToRefs(notificationStore)

  const notificationsSize = computed((): number => {
    return allNotifications.value.length
  })

  // Get all notifications.
  watch(() => userStore.currentUser as User, ({ uid }): void => {
    if (uid && allNotifications.value.length === 0) {
      // Get all if the list is initially empty.
      notificationStore.getAllNotifications(uid)
        .then((notifications: INotificationList) => {
          notificationStore.setAllNotification(notifications)
        })
    }
  }, { immediate: true })

  return {
    notificationsSize,
    allNotifications,
  }
}

export default useNotifications
