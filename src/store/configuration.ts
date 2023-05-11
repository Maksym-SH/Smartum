import { ref } from 'vue'
import { defineStore } from 'pinia'

import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import type { ErrorCode } from '@/types/types'
import { database } from '@/helpers/firebase/firebaseInitialize'
import { Colors, DataCollection } from '@/types/enums'
import type {
  IAsideNavigationItem,
  IConfiguration,
  IConfigurationAdditional,
  IConfigurationResponse,
} from '@/types/interfaces'

import useStores from '@/composables/useStores'
import ShowErrorMessage from '@/helpers/firebase/firebaseErrorMessage'
import allAsideNavigations from '@/composables/useAsideNavigation'

const useConfigurationStore = defineStore('configuration', () => {
  const { commonStore } = useStores()

  const asideNavigate = ref<IAsideNavigationItem[]>([])
  const additionalParams = ref({
    asideBackgroundColor: Colors.Grey as string,
    showEmailConfirm: false,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  })

  const setAdditionalParams = (
    params: Omit<IConfiguration, 'navigations'>,
  ): void => {
    additionalParams.value = params
  }
  const setNavigateList = (navigationList: IAsideNavigationItem[]): void => {
    asideNavigate.value = navigationList
  }
  const createUserConfiguration = (unicID: string): Promise<void> => {
    const navigationsShow = allAsideNavigations().map(item => item.showed)

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      const settings: IConfigurationResponse = {
        navigationsShowValues: navigationsShow,
        showEmailConfirm: true,
        asideBackgroundColor: Colors.Grey,
        showCurrentDate: true, // Time and date in app header.
        showDeleteAccountButton: true,
      }

      setDoc(doc(database, DataCollection.Configuration, unicID), settings)
        .then(() => resolve())
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }
  const getUserConfiguration = (unicID: string): Promise<IConfigurationResponse> => {
    const configurationRef = doc(
      database,
      DataCollection.Configuration,
      unicID,
    )

    return new Promise((resolve, reject) => {
      getDoc(configurationRef)
        .then((configuration): void => {
          const responseData = configuration.data() as IConfigurationResponse

          if (responseData) {
            const { navigationsShowValues, ...additionalParams } = responseData

            const navigationShowingStatus: boolean[] = navigationsShowValues

            // Set displaying all aside navigation items.
            const showedNavigations = allAsideNavigations()
            showedNavigations.forEach(
              (item, index) => (item.showed = navigationShowingStatus[index]),
            )
            setNavigateList(showedNavigations)

            // Set additional params.
            setAdditionalParams(additionalParams)
          }
          resolve(responseData)
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
    })
  }
  const deleteUserConfiguration = (unicID: string): Promise<void> => {
    const configurationRef = doc(
      database,
      DataCollection.Configuration,
      unicID,
    )

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      deleteDoc(configurationRef)
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }
  const updateAdditionalParams = (
    additional: IConfigurationAdditional,
    unicID: string,
  ): Promise<void> => {
    const configurationRef = doc(
      database,
      DataCollection.Configuration,
      unicID,
    )

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      updateDoc(configurationRef, {
        ...additional,
      })
        .then(() => {
          getUserConfiguration(unicID)
          resolve()
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }
  const updateNavigateItem = (
    navigations: boolean[],
    unicID: string,
  ): Promise<void> => {
    const configurationRef = doc(
      database,
      DataCollection.Configuration,
      unicID,
    )

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      updateDoc(configurationRef, {
        navigationsShowValues: navigations,
      })
        .then(() => {
          getUserConfiguration(unicID)
          resolve()
        })
        .catch((error: ErrorCode): void => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }

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
  }
})

export default useConfigurationStore
