import { ref } from "vue";
import { defineStore } from "pinia";
import { database } from "@/helpers/firebase/firebaseInitialize";
import * as fs from "firebase/firestore";

import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import allAsideNavigations from "@/composables/useAsideNavigation";
import useStores from "@/composables/useStores";

import type { ErrorCode } from "@/types";
import type * as configType from "@/types/interfaces/components";
import { Colors, DataCollection } from "@/types/enums";

const useConfigurationStore = defineStore("configuration", () => {
  const { commonStore } = useStores();

  const asideNavigate = ref<configType.IAsideNavItem[]>();

  const additionalParams = ref({
    asideBackgroundColor: Colors.GREY as string,
    showEmailConfirm: false,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  });

  const setAdditionalParams = (
    params: Omit<configType.IConfiguration, "navigations">
  ): void => {
    additionalParams.value = params;
  };

  const setNavigateList = (navigationList: configType.IAsideNavItem[]): void => {
    asideNavigate.value = navigationList;
  };

  const createUserConfiguration = (unicID: string): Promise<void> => {
    const navigationsShow = allAsideNavigations().map((item) => item.showed);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      const settings: configType.IConfigurationResponse = {
        navigationsShowValues: navigationsShow,
        showEmailConfirm: true,
        asideBackgroundColor: Colors.GREY,
        showCurrentDate: true, // Time and date in app header.
        showDeleteAccountButton: true,
      };

      fs.setDoc(fs.doc(database, DataCollection.CONFIGURATION, unicID), settings)
        .then(() => resolve())
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };
  const getUserConfiguration = (
    unicID: string
  ): Promise<configType.IConfigurationResponse> => {
    const configurationRef = fs.doc(database, DataCollection.CONFIGURATION, unicID);

    return new Promise((resolve, reject) => {
      fs.getDoc(configurationRef)
        .then((configuration): void => {
          const responseData = configuration.data() as configType.IConfigurationResponse;

          if (responseData) {
            const { navigationsShowValues, ...additionalParams } = responseData;

            const navigationShowingStatus: boolean[] = navigationsShowValues;

            // Set displaying all aside navigation items.
            const showedNavigations = allAsideNavigations();
            showedNavigations.forEach(
              (item, index) => (item.showed = navigationShowingStatus[index])
            );
            setNavigateList(showedNavigations);

            // Set additional params.
            setAdditionalParams(additionalParams);
          }
          resolve(responseData);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };
  const deleteUserConfiguration = (unicID: string): Promise<void> => {
    const configurationRef = fs.doc(database, DataCollection.CONFIGURATION, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.deleteDoc(configurationRef)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };
  const updateAdditionalParams = (
    additional: configType.IConfigAdditional,
    unicID: string
  ): Promise<void> => {
    const configurationRef = fs.doc(database, DataCollection.CONFIGURATION, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.updateDoc(configurationRef, {
        ...additional,
      })
        .then(() => {
          getUserConfiguration(unicID);
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };
  const updateNavigateItem = (navigations: boolean[], unicID: string): Promise<void> => {
    const configurationRef = fs.doc(database, DataCollection.CONFIGURATION, unicID);

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      fs.updateDoc(configurationRef, {
        navigationsShowValues: navigations,
      })
        .then(() => {
          getUserConfiguration(unicID);
          resolve();
        })
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  return {
    asideNavigate,
    additionalParams,
    setAdditionalParams,
    setNavigateList,
    createUserConfiguration,
    deleteUserConfiguration,
    updateAdditionalParams,
    updateNavigateItem,
    getUserConfiguration,
  };
});

export default useConfigurationStore;
