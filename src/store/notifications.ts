import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { DataCollection } from '@/types/enums'
import type { INotification, IServerDate } from '@/types/interfaces'
import { database } from '@/helpers/firebase/firebaseInitialize'
import type { ErrorCode, INotificationList, NotifyAction } from '@/types/types'

import ShowErrorMessage from '@/helpers/firebase/firebaseErrorMessage'
import useStores from '@/composables/useStores'

const useNotificationStore = defineStore('notification', () => {
  const { commonStore, userStore } = useStores()

  const allNotifications = ref<INotification<IServerDate | Date>[]>([])

  const setAllNotification = (notifications: INotificationList): void => {
    allNotifications.value = notifications
  }

  const createNotificationList = (
    notification: INotification<Date>,
    unicID: string,
  ): Promise<INotification<Date>> => {
    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      setDoc(doc(database, DataCollection.Notifications, unicID), {
        collection: [notification],
      })
        .then(() => {
          resolve(notification)
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally((): void => commonStore.setLoadingStatus(false))
    })
  }

  const getAllNotifications = (unicID: string): Promise<any> => {
    const profileRef = doc(database, DataCollection.Notifications, unicID)

    return new Promise((resolve, reject) => {
      getDoc(profileRef)
        .then((response) => {
          const notifications = response.data()
          if (notifications)
            resolve(notifications.collection)
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
    })
  }

  const updateNotificationList = (unicID: string, notifications?: INotification<IServerDate | Date>[]): Promise<INotification<IServerDate>[]> => {
    const notificationRef = doc(database, DataCollection.Notifications, unicID)

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      updateDoc(notificationRef, {
        collection: notifications || allNotifications.value,
      }).then(() => {
        getAllNotifications(unicID)
          .then((notifications: INotification<IServerDate>[]) => {
            resolve(notifications)
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error)
            reject(error)
          })
          .finally(() => commonStore.setLoadingStatus(false))
      })
    })
  }

  const notificationAction = (id: number, action: NotifyAction, notifications?: INotificationList, unicID?: string): void => {
    const listTarget = notifications || allNotifications.value

    const foundNotificationIndex = listTarget.findIndex(
      notify => notify.id === id,
    )

    if (foundNotificationIndex !== -1) {
      // Delete notification.
      if (action === 'deleteNotification')
        listTarget.splice(foundNotificationIndex, 1)
      else
        listTarget[foundNotificationIndex].status = 'read'
    }

    const docID = unicID || (userStore.currentUser as User).uid

    updateNotificationList(docID, notifications || allNotifications.value) // After local changes update database.
  }

  const setNewNotification = (newNotification: INotification<IServerDate | Date>, notifications?: INotificationList, unicID?: string): void => {
    const listTarget = notifications || allNotifications.value

    listTarget.push(newNotification)

    const docID = unicID || (userStore.currentUser as User).uid

    updateNotificationList(docID, listTarget) // After local changes update database.
  }

  const deleteNotificationList = (unicID: string): Promise<void> => {
    const deleteNotificationList = doc(
      database,
      DataCollection.Notifications,
      unicID,
    )

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      deleteDoc(deleteNotificationList)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }

  const clearList = (): void => {
    allNotifications.value = []
  }

  return {
    allNotifications,
    setAllNotification,
    setNewNotification,
    notificationAction,
    clearList,
    updateNotificationList,
    deleteNotificationList,
    createNotificationList,
    getAllNotifications,
  }
})

export default useNotificationStore
