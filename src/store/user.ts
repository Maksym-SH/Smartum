import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { User } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import { notify } from '@kyvg/vue3-notification'
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import {
  ref as Refference,
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  uploadBytes,
} from 'firebase/storage'
import type {
  ICreateUser,
  IPictureParams,
  IUserCreated,
  IUserForList,
  IUserInfo,
} from '@/types/interfaces'

import type { ErrorCode, IUserFieldsUpdate } from '@/types/types'
import { database } from '@/helpers/firebase/firebaseInitialize'
import { DataCollection } from '@/types/enums'
import { SetTheme } from '@/helpers/methods'

import router from '@/router'
import ShowErrorMessage from '@/helpers/firebase/firebaseErrorMessage'
import useStores from '@/composables/useStores'

const useUserStore = defineStore('user', () => {
  const { commonStore, notificationStore, configurationStore, dashboardStore } = useStores()

  const storage = getStorage()

  const currentUser = ref<User | {}>({})
  const userInfo = ref<IUserCreated>({
    firstName: '',
    lastName: '',
    about: '',
    phone: '',
    avatarParams: {
      url: '',
      bgAvatar: '',
    },
  })

  // Avatar settings.
  const setBackgroundAvatar = (background: string): void => {
    userInfo.value.avatarParams.bgAvatar = background
  }

  const getAllUserAvatars = (): Promise<string[]> => {
    const storage = getStorage()
    const listAvatarsRef = Refference(storage, import.meta.env.VITE_APP_ALL_AVATAR_PATH)

    return new Promise((resolve, reject) => {
      listAll(listAvatarsRef).then((response) => {
        const promises = response.items.map(item => getDownloadURL(item))

        Promise.all(promises).then((photos: string[]) => resolve(photos))
      }).catch((error: ErrorCode) => {
        ShowErrorMessage(error)
        reject(error)
      })
    })
  }

  const getUserAvatar = (unicID: string): Promise<string> => {
    const storage = getStorage()
    const avatarRef = Refference(storage, unicID)

    return new Promise((resolve) => {
      getDownloadURL(avatarRef).then((avatarParams) => {
        resolve(avatarParams)
      })
    })
  }
  const updateUserAvatar = (
    file: File | null,
    unicID: string,
  ): Promise<string> | IPictureParams => {
    if (!file)
      return userInfo.value.avatarParams

    const storageRef = Refference(storage, unicID)
    return new Promise((resolve, reject) => {
      uploadBytes(storageRef, file)
        .then(() => {
          // Get image url after upload.
          getUserAvatar(unicID).then((url: string) => resolve(url))
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
    })
  }
  const deleteUserAvatar = (unicID: string): Promise<void> => {
    const deleteAvatarRef = Refference(storage, unicID)
    return new Promise((resolve, reject) => {
      deleteObject(deleteAvatarRef)
        .then(() => {
          resolve()
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
    })
  }
  // User settings.
  const setCurrentUser = (user: User | {}): void => {
    currentUser.value = user
  }
  const setUserInfo = (params: IUserCreated): void => {
    userInfo.value = params
  }
  const getUserProfile = (unicID: string): Promise<IUserCreated> => {
    // Profile document by unicID in database.
    const profileRef = doc(database, DataCollection.Profile, unicID)

    commonStore.setLoadingStatus(true)

    return new Promise((resolve, reject) => {
      // Get profile info.
      getDoc(profileRef)
        .then(async (response) => {
          const info = response.data() as IUserCreated
          if (info) {
            // Get user avatar.
            if (info.avatarParams.url) {
              await getUserAvatar(unicID).then(
                (photo: string) => (info.avatarParams.url = photo),
              )
            }
            setUserInfo(info)
            resolve(info)
          }
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }
  const createUserProfile = (info: Partial<ICreateUser>): Promise<void> => {
    const unicID = info.uid as string // Unic id for database field access.

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      // Create new profile collection.
      setDoc(doc(database, DataCollection.Profile, unicID), {
        firstName: info.firstName,
        lastName: info.lastName || '',
        avatarParams: {
          url: '',
          bgAvatar: info.avatarParams?.bgAvatar,
        },
        about: '',
        phone: '',
      })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }

  // Other users
  const getUsersList = (loadPhotos?: boolean, showLoading = true, myID?: string): Promise<IUserForList[]> => {
    const userListRef = doc(database, DataCollection.Users, import.meta.env.VITE_APP_ALL_USER_COLLECTION)

    commonStore.setLoadingStatus(showLoading)

    return new Promise((resolve, reject) => {
      getDoc(userListRef)
        .then((response) => {
          const usersList = response.data()?.collection as IUserInfo[]

          if (loadPhotos) {
            getAllUserAvatars().then((list) => {
              usersList.map((user) => {
                return user.avatarParams.url = list.find(item => item.includes(user.uid as string)) as string
              })
            })
          }

          if (myID) { // Put myself first in the users list. // ToDo
          }

          resolve(usersList as IUserForList[])
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(showLoading))
    })
  }

  const updateUsersList = (newUserInfo: Partial<IUserForList> | null, deleteUser?: Boolean): Promise<IUserForList[]> => {
    const usersListRef = doc(database, DataCollection.Users, import.meta.env.VITE_APP_ALL_USER_COLLECTION)

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      getUsersList().then((usersList) => {
        if (usersList) {
          const foundUserIndex = usersList.findIndex(user => user.uid === (newUserInfo as IUserForList).uid)

          if (foundUserIndex !== -1) { // User was found.
            if (deleteUser)
              usersList.splice(foundUserIndex, 1)
            else
              usersList[foundUserIndex] = newUserInfo as IUserForList
          }
          else if ((currentUser.value as User).emailVerified) {
            usersList.push(newUserInfo as IUserForList)
          }

          updateDoc(usersListRef, {
            collection: usersList,
          }).then(() => resolve(usersList))
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error)
              reject(error)
            })
            .finally(() => commonStore.setLoadingStatus(false))
        }
      })
    })
  }

  const updateUserInfo = async (data: IUserInfo): Promise<void> => {
    const unicID = data.uid as string // Unic id for database field access.
    const profileRef = doc(database, DataCollection.Profile, unicID)

    const {
      firstName,
      lastName,
      avatarParams,
      photoFile,
      about,
      phone,
    }: IUserInfo = data

    const fieldsToUpdate: IUserFieldsUpdate = {
      firstName,
      lastName,
      avatarParams: {
        url: avatarParams.url,
        bgAvatar: userInfo.value.avatarParams.bgAvatar,
      },
      about,
      phone,
    }

    commonStore.setLoadingStatus(true)
    // New upload image.
    if (photoFile !== null) {
      await (updateUserAvatar(photoFile, unicID) as Promise<string>).then(
        (photo: string) => {
          if (fieldsToUpdate.avatarParams)
            fieldsToUpdate.avatarParams.url = photo
        },
      )
    }
    // Photo has been removed.
    else if (!avatarParams.url && userInfo.value.avatarParams.url) {
      await deleteUserAvatar(unicID).then(() => {
        if (fieldsToUpdate.avatarParams)
          fieldsToUpdate.avatarParams.url = ''
      })
    }
    return new Promise((resolve, reject) => {
      updateDoc(profileRef, fieldsToUpdate)
        .then(() => {
          updateUsersList({ ...fieldsToUpdate as IUserInfo, uid: unicID })
          getUserProfile(unicID).then(() => resolve())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
    })
  }
  const deleteUserProfile = (unicID: string): Promise<void> => {
    commonStore.setLoadingStatus(true)

    return new Promise((resolve, reject) => {
      const deleteUserProfile = doc(database, DataCollection.Profile, unicID)
      const currentUserAvatar = userInfo.value.avatarParams.url

      deleteDoc(deleteUserProfile)
        .then(() => {
          if (currentUserAvatar)
            deleteUserAvatar(unicID)

          notificationStore.deleteNotificationList(unicID)
          configurationStore.deleteUserConfiguration(unicID)
          resolve()
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }

  const updateUserBackgroundAvatar = (
    bgAvatar: string,
    unicID: string,
  ): Promise<void> => {
    const profileRef = doc(database, DataCollection.Profile, unicID)

    commonStore.setLoadingStatus(true)

    return new Promise((resolve, reject) => {
      updateDoc(profileRef, {
        avatarParams: {
          url: userInfo.value.avatarParams.url,
          bgAvatar,
        },
      })
        .then(() => {
          resolve()
          setBackgroundAvatar(bgAvatar)
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error)
          commonStore.setLoadingStatus(false)
          reject(error)
        })
        .finally(() => commonStore.setLoadingStatus(false))
    })
  }

  const userLogout = async (): Promise<void> => {
    return await getAuth()
      .signOut()
      .then(() => {
        setCurrentUser({})

        commonStore.setConfirmPopupVisibillity(false)

        setUserInfo({
          firstName: '',
          lastName: '',
          about: '',
          phone: '',
          avatarParams: {
            url: '',
            bgAvatar: '',
          },
        })
        // Set dark theme by default.
        SetTheme('dark')
        localStorage.removeItem('smartumTheme')

        notificationStore.clearList() // Clear any notifications.
        dashboardStore.clearList() // Clear any boards.

        if (!router.currentRoute.value.meta.notAuthorized) {
          router.push({ name: 'SignIn' })
          localStorage.removeItem('smartumToken')
        }
      })
      .catch((error: ErrorCode) =>
        notify({
          title: 'Произошла ошибка!',
          text: String(error),
        }),
      )
      .finally(() => commonStore.setLoadingStatus(false))
  }

  return {
    currentUser,
    userInfo,
    getUsersList,
    setCurrentUser,
    setUserInfo,
    setBackgroundAvatar,
    createUserProfile,
    updateUserInfo,
    updateUsersList,
    deleteUserProfile,
    getUserProfile,
    updateUserAvatar,
    updateUserBackgroundAvatar,
    deleteUserAvatar,
    getUserAvatar,
    userLogout,
  }
})

export default useUserStore
