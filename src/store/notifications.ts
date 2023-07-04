import { ref } from "vue";
import { defineStore } from "pinia";
import { database } from "@/helpers/firebase/firebaseInitialize";

import * as fs from "firebase/firestore";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

import { DataCollection, NotificationStatus } from "@/types/enums";
import type { User } from "firebase/auth";
import type { IServerDate } from "@/types/interfaces";
import type { INotification } from "@/types/interfaces/components";
import type { IWorkingBoardMember } from "@/types/interfaces/board";
import type { ErrorCode, NotifyAction } from "@/types/types";

const useNotificationStore = defineStore("notification", () => {
  const { commonStore, userStore } = useStores();

  const allNotifications = ref<INotification[]>([]);

  const setAllNotification = (notifications: INotification[]): void => {
    allNotifications.value = notifications;
  };

  const createNotificationList = (
    notification: INotification<Date>,
    unicID: string
  ): Promise<INotification> => {
    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.setDoc(fs.doc(database, DataCollection.NOTIFICATIONS, unicID), {
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

  const getAllNotifications = (unicID: string, write = false): Promise<INotification[]> => {
    return new Promise((resolve) => {
      fs.onSnapshot(fs.doc(database, DataCollection.NOTIFICATIONS, unicID), (doc) => {
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
    const notificationRef = fs.doc(database, DataCollection.NOTIFICATIONS, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.updateDoc(notificationRef, {
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
    notifications?: INotification[],
    unicID?: string
  ): void => {
    const listTarget = notifications || allNotifications.value;

    const foundNotificationIndex = listTarget.findIndex((notify) => notify.id === id);

    if (foundNotificationIndex !== -1) {
      // Delete notification.
      if (action === "deleteNotification") listTarget.splice(foundNotificationIndex, 1);
      else listTarget[foundNotificationIndex].status = NotificationStatus.READ;
    }

    const docID: string = unicID || (userStore.currentUser as User).uid;

    updateNotificationList(docID, notifications || allNotifications.value); // After local changes update database.
  };

  const setNewNotification = async (
    newNotification: INotification,
    notifications?: INotification[],
    unicID?: string
  ): Promise<INotification[]> => {
    const listTarget = notifications || allNotifications.value;
    listTarget.unshift(newNotification);

    const docID = unicID || (userStore.currentUser as User).uid;

    return await updateNotificationList(docID, listTarget); // After local changes update database.
  };

  const deleteNotificationList = (unicID: string): Promise<void> => {
    const deleteNotificationList = fs.doc(database, DataCollection.NOTIFICATIONS, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.deleteDoc(deleteNotificationList)
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
