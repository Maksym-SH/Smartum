import { IAsideNavigationItem, IConfigurationState, IConfiguration } from "@/interfaces";
import { ErrorCode, ModuleCtx } from "@/types";
import { database } from "@/main";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { Colors, DataCollection } from "@/enums";
import allAsideNavigates from "@/composables/useAsideNavigation";

export default {
  state: {
    asideNavigate: [],
    navigationNames: [],
  },
  mutations: {
    setNavigationNames(state: IConfigurationState, names: Array<string>): void {
      state.navigationNames = names;
    },
    setNavigateList(state: IConfigurationState, navigationList: IAsideNavigationItem[]): void {
      console.log(navigationList)
      state.asideNavigate = navigationList;
    }
  },
  actions: {
    createUserConfiguration({ commit }: ModuleCtx<IConfigurationState>, unicID: string): Promise<void> {
      const navigationsShow = allAsideNavigates().map((item) => item.showed);
      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Configuration, unicID), {
          navigationsShowValues: navigationsShow,
          showEmailConfirm: true,
          asideBackgroundColor: Colors.Grey,
          showCurrentDate: true, // Time and date in app header.
          dontShowNotifications: false,
          hideDeleteAccountButton: false,
        })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally((): void => commit("setLoadingStatus", false))
      })  
    },
    updateNavigateItem({ state, commit }: ModuleCtx<IConfigurationState>, unicID: string): Promise<void> {
      const updateNavigates = doc(database, DataCollection.Notifications, unicID);

      const navigationList = state.asideNavigate;

      commit("setLoadingStatus", true);
      return new Promise((resolve, reject) => {
        updateDoc(updateNavigates, {
          navigations: navigationList
        })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    getUserConfiguration({ commit }: ModuleCtx<IConfigurationState>, unicID: string): Promise<any> {
      const configurationRef = doc(database, DataCollection.Configuration, unicID);

      return new Promise((resolve, reject) => {
        getDoc(configurationRef)
        .then((configuration) => {
          const responseData = configuration.data();

          if (responseData) {
            const valuesShow: Array<boolean> = responseData.navigationsShowValues;
            // Set displaying all aside navigation items.
            const showedNavigations = allAsideNavigates();
            showedNavigations.forEach((item, index) => item.showed = valuesShow[index]);

            commit("setNavigateList", showedNavigations);
            commit("setNavigationNames", responseData.navigations);
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