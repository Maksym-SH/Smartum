import { ref } from "vue";
import { defineStore } from "pinia";
import type { User } from "firebase/auth";
import { deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { DataCollection } from "@/types/enums";
import type { INotification, IServerDate, IWorkingBoardMember } from "@/types/interfaces";
import { database } from "@/helpers/firebase/firebaseInitialize";
import type { ErrorCode, INotificationList, NotifyAction } from "@/types/types";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

const useNotificationStore = defineStore("notification", () => {
  const { commonStore, userStore } = useStores();

  const allNotifications = ref<INotification[]>([]);

  const setAllNotification = (notifications: INotificationList): void => {
    allNotifications.value = notifications;
  };

  const createNotificationList = (
    notification: INotification<Date>,
    unicID: string
  ): Promise<INotification> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      setDoc(doc(database, DataCollection.Notifications, unicID), {
        collection: [notification],
      })
        .then(() => {
          resolve(notification);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally((): void => commonStore.setLoadingStatus(false));
    });
  };

  const getAllNotifications = (
    unicID: string,
    write = false
  ): Promise<INotification[]> => {
    return new Promise((resolve) => {
      onSnapshot(doc(database, DataCollection.Notifications, unicID), (doc) => {
        const notifications = doc.data()?.collection as INotification<IServerDate>[];
        if (notifications) {
          resolve(notifications);
          if (write) {
            setAllNotification(notifications);
          }
        }
      });
    });
  };

  const updateNotificationList = (
    unicID: string,
    notifications?: INotification[]
  ): Promise<INotification[]> => {
    const notificationRef = doc(database, DataCollection.Notifications, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      updateDoc(notificationRef, {
        collection: notifications || allNotifications.value,
      }).then(() => {
        getAllNotifications(unicID)
          .then((notifications: INotification[]) => {
            resolve(notifications);
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally(() => commonStore.setLoadingStatus(false));
      });
    });
  };

  const sendNotificationToUser = (
    userTarget: IWorkingBoardMember,
    notification: INotification,
    showLoading = true
  ): Promise<void> => {
    commonStore.setLoadingStatus(showLoading);

    return new Promise(async (resolve, reject) => {
      try {
        const userNotificationList = await getAllNotifications(userTarget.uid);
        await setNewNotification(notification, userNotificationList, userTarget.uid);
        resolve();
      } catch (error: any) {
        ShowErrorMessage(error as ErrorCode);
        reject(error);
      } finally {
        commonStore.setLoadingStatus(false);
      }
    });
  };

  const notificationAction = (
    id: number,
    action: NotifyAction,
    notifications?: INotificationList,
    unicID?: string
  ): void => {
    const listTarget = notifications || allNotifications.value;

    const foundNotificationIndex = listTarget.findIndex((notify) => notify.id === id);

    if (foundNotificationIndex !== -1) {
      // Delete notification.
      if (action === "deleteNotification") listTarget.splice(foundNotificationIndex, 1);
      else listTarget[foundNotificationIndex].status = "read";
    }

    const docID: string = unicID || (userStore.currentUser as User).uid;

    updateNotificationList(docID, notifications || allNotifications.value); // After local changes update database.
  };

  const setNewNotification = async (
    newNotification: INotification,
    notifications?: INotificationList,
    unicID?: string
  ): Promise<INotification[]> => {
    const listTarget = notifications || allNotifications.value;
    listTarget.unshift(newNotification);

    const docID = unicID || (userStore.currentUser as User).uid;

    return await updateNotificationList(docID, listTarget); // After local changes update database.
  };

  const deleteNotificationList = (unicID: string): Promise<void> => {
    const deleteNotificationList = doc(database, DataCollection.Notifications, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      deleteDoc(deleteNotificationList)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  const clearList = (): void => {
    allNotifications.value = [];
  };

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
    sendNotificationToUser,
  };
});

export default useNotificationStore;
