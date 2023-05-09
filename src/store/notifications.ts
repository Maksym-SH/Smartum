import { ref } from "vue";
import { defineStore } from "pinia";

import { DataCollection } from "@/types/enums";
import { INotification, IServerDate } from "@/types/interfaces";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { ErrorCode } from "@/types/types";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

const useNotificationStore = defineStore("notification", () => {
  const { commonStore } = useStores();

  const newNotification = ref<INotification<IServerDate> | {}>({});


  const setNewNotification = (notification: INotification<Date>): void => {
    newNotification.value = notification;
  };
  const clearNewNotification = (): void => {
    newNotification.value = {}
  };
  const updateNotifications = (notifications: INotification<IServerDate | Date>[], unicID: string)
                                                                  : Promise<INotification<IServerDate>[]> => {
    const notificationRef = doc(database, DataCollection.Notifications, unicID)

    return new Promise((resolve, reject) => {
      updateDoc(notificationRef, {
        collection: notifications 
      })
      .then(() => {
        getAllNotifications(unicID)
        .then((notifications: INotification<IServerDate>[]) => {
          resolve(notifications)
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
      })
    })
  };
  const getAllNotifications =(unicID: string): Promise<any> => {
    const profileRef = doc(database, DataCollection.Notifications, unicID);

    return new Promise((resolve, reject) => {
      getDoc(profileRef).then((response) => {
        const notifications = response.data();
        if (notifications) {
          resolve(notifications.collection)
        }
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error)
      })
    })
  };
  const deleteNotificationList = (unicID: string): Promise<void> => {
    const deleteNotificationList = doc(database, DataCollection.Notifications, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      deleteDoc(deleteNotificationList)
      .then(() => resolve())
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error)
      })
      .finally(() => commonStore.setLoadingStatus(false))
    })
  };
  const createNotificationList = (item: INotification<Date>, unicID: string): Promise<void> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      setDoc(doc(database, DataCollection.Notifications, unicID), {
        collection: [ item ]
      })
      .then(() => resolve())
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error);
      })
      .finally((): void => commonStore.setLoadingStatus(false))
    })  
  }

  return {
    newNotification,
    setNewNotification,
    clearNewNotification,
    updateNotifications,
    deleteNotificationList,
    createNotificationList,
    getAllNotifications
  }
})


export default useNotificationStore;