import { DataCollection } from "@/enums";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { CreateNotifyList, INotificationDate, INotificationItem, INotificationState, IRootState, IUpdateNotifications } from "@/interfaces";
import { database } from "@/main";
import { ErrorCode, ModuleCtx } from "@/types";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";


export default {
  state: {
    newNotification: {}
  },
  getters: {
    getNewNotification(state: INotificationState): INotificationItem<INotificationDate> | {} {
      return state.newNotification;
    }
  },
  mutations: {
    SET_NEW_NOTIFICATION(state: INotificationState, notification: INotificationItem<INotificationDate>): void {
      state.newNotification = notification;
    },
    CLEAR_NEW_NOTIFICATION(state: INotificationState): void {
      state.newNotification = {}
    }
  },
  actions: {
    // Notifications
    setNewNotification({ commit }: ModuleCtx<IRootState>, data: Partial<INotificationItem<Date>>): void {
      commit("SET_NEW_NOTIFICATION", {
        ...data,
        id: Date.now(),
        date: new Date()
      });
    },
    clearNewNotification({ commit }: ModuleCtx<INotificationState>): void {
      commit("CLEAR_NEW_NOTIFICATION");
    },
    updateNotifications({ commit, dispatch }: ModuleCtx<INotificationState>,
                                                        data: IUpdateNotifications): Promise<void> {

      const notificationRef = doc(database, DataCollection.Notifications, data.unicID)
      return new Promise((resolve, reject) => {
        updateDoc(notificationRef, {
          collection: data.notifications 
        }).then(() => {
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
    getAllNotifications({ dispatch }: ModuleCtx<INotificationState>, unicID: string): Promise<any> {
      const profileRef = doc(database, DataCollection.Notifications, unicID);
      
      dispatch("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        getDoc(profileRef).then((notifications) => {
          resolve(notifications.data())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })
    },
    deleleNotificationList({ dispatch }: ModuleCtx<INotificationState>, unicID: string): Promise<void> {
      const deleteNotificationList = doc(database, DataCollection.Notifications, unicID);

      dispatch("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        deleteDoc(deleteNotificationList)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })
    },
    createNotificationList({ dispatch }: ModuleCtx<INotificationState>, info: CreateNotifyList): Promise<void> {
      dispatch("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Notifications, info.unicID), {
          collection: [info.item]
        })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })  
    }
  }
}