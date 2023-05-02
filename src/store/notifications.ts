import { DataCollection } from "@/enums";
import { ICreateNotifyList, INotificationItem, INotificationState, IUpdateNotifications } from "@/interfaces";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { ErrorCode, ModuleCtx } from "@/types";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";

export default {
  state: {
    newNotification: {}
  },
  mutations: {
    setNewNotification(state: INotificationState, notification: INotificationItem<Date>): void {
      state.newNotification = notification;
    },
    clearNewNotification(state: INotificationState): void {
      state.newNotification = {}
    }
  },
  actions: {
    updateNotifications({ dispatch }: ModuleCtx<INotificationState>,
                                                      data: IUpdateNotifications): Promise<void> {

      const notificationRef = doc(database, DataCollection.Notifications, data.unicID)

      return new Promise((resolve, reject) => {
        updateDoc(notificationRef, {
          collection: data.notifications 
        })
        .then(() => {
          dispatch("getAllNotifications", data.unicID)
          .then((notifications) => {
            resolve(notifications)
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
        })
      })
    },
    getAllNotifications(_: any, unicID: string): Promise<any> {
      const profileRef = doc(database, DataCollection.Notifications, unicID);

      return new Promise((resolve, reject) => {
        getDoc(profileRef).then((notifications) => {
          resolve(notifications.data())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
      })
    },
    deleleNotificationList({ commit }: ModuleCtx<INotificationState>, unicID: string): Promise<void> {
      const deleteNotificationList = doc(database, DataCollection.Notifications, unicID);

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        deleteDoc(deleteNotificationList)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    createNotificationList({ commit }: ModuleCtx<INotificationState>, info: ICreateNotifyList): Promise<void> {
      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Notifications, info.unicID), {
          collection: [info.item]
        })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally((): void => commit("setLoadingStatus", false))
      })  
    }
  }
}