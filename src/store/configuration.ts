import { 
  IAsideNavigationItem, 
  IConfigState, 
  IConfiguration, 
  IAdditionalUpdate, 
  INavigationListUpdate 
} from "@/interfaces";
import { ErrorCode, ModuleCtx } from "@/types";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Colors, DataCollection } from "@/enums";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import allAsideNavigations from "@/composables/useAsideNavigation";

export default {
  state: {
    asideNavigate: [],
    additionalParams: {
      asideBackgroundColor: Colors.Grey as string,
      showEmailConfirm: false,
      showCurrentDate: false, // Time and date in app header.
      showDeleteAccountButton: false,
    }
  },
  mutations: {
    setAdditionalParams(state: IConfigState, params: Omit<IConfiguration, "navigations">): void {
      state.additionalParams = params;
    },
    setNavigateList(state: IConfigState, navigationList: IAsideNavigationItem[]): void {
      state.asideNavigate = navigationList;
    }
  },
  actions: {
    createUserConfiguration({ commit }: ModuleCtx<IConfigState>, unicID: string): Promise<void> {
      const navigationsShow = allAsideNavigations().map((item) => item.showed);

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Configuration, unicID), {
          navigationsShowValues: navigationsShow,
          showEmailConfirm: true,
          asideBackgroundColor: Colors.Grey,
          showCurrentDate: true, // Time and date in app header.
          showDeleteAccountButton: true,
        })
        .then(() => resolve())
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false))
      })  
    },
    deleteUserConfiguration( { commit }: ModuleCtx<IConfigState>, unicID: string): Promise<void> {
      const deleteNotificationList = doc(database, DataCollection.Configuration, unicID);

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
    updateAdditionalParams({ commit, dispatch }: ModuleCtx<IConfigState>, data: IAdditionalUpdate): Promise<void> {
      const configurationRef = doc(database, DataCollection.Configuration, data.unicID);

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        updateDoc(configurationRef, {
          ...data.additional
        })
        .then(() => {
          dispatch("getUserConfiguration", data.unicID);
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    updateNavigateItem({ commit, dispatch }: ModuleCtx<IConfigState>,
                                                           data: INavigationListUpdate): Promise<void> {

      const configurationRef = doc(database, DataCollection.Configuration, data.unicID);

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        updateDoc(configurationRef, {
          navigationsShowValues: data.navigations
        })
        .then(() => {
          dispatch("getUserConfiguration", data.unicID);
          resolve();
        })
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    getUserConfiguration({ commit }: ModuleCtx<IConfigState>, unicID: string): Promise<any> {
      const configurationRef = doc(database, DataCollection.Configuration, unicID);

      return new Promise((resolve, reject) => {
        getDoc(configurationRef)
        .then((configuration): void => {
          const responseData = configuration.data();

          if (responseData) {
            const navigationDisplayStatus: boolean[] = responseData.navigationsShowValues;

            // Set displaying all aside navigation items.
            const showedNavigations = allAsideNavigations();
            showedNavigations.forEach((item, index) => item.showed = navigationDisplayStatus[index]);
            commit("setNavigateList", showedNavigations);

            // Set additional params.

            // Delete navigatinShowValues object field.
            const params = (({ navigationsShowValues, ...params }) => params)(responseData);

            commit("setAdditionalParams", params)
          }
          resolve(responseData);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
      })
    },
  },
}