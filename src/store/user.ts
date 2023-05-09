import { defineStore } from "pinia";
import { ref } from "vue";

import { getAuth, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, ICreateUser, IPictureParams, IUserInfo,} from "@/types/interfaces";

import { ErrorCode, IUserFieldsUpdate } from "@/types/types"; 
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref as Refference, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { database } from "@/helpers/firebase/firebaseInitialize";
import { DataCollection } from "@/types/enums";
import { SetTheme } from "@/helpers/methods";

import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

const useUserStore = defineStore("user", () => {
  const { commonStore, notificationStore, configurationStore } = useStores();

  const storage = getStorage();

  const currentUser = ref<User | {}>({});
  const userInfo = ref<IUserCreated>({
    firstName: "",
    lastName: "",
    about: "",
    phone: "",
    avatarParams: {
      url: "",
      bgAvatar: ""
    }
  })


  const setCurrentUser = (user: User | {}): void => {
    currentUser.value = user;
  };
  const setUserInfo = (params: IUserCreated): void => {
    userInfo.value = params;
  };
  const setBackgroundAvatar = (background: string): void => {
    userInfo.value.avatarParams.bgAvatar = background;
  };
  const createUserProfile = (info: Partial<ICreateUser>): Promise<void> => {
    const unicID = info.uid as string; // Unic id for database field access.

    commonStore.setLoadingStatus(true)
    return new Promise((resolve, reject) => {
      // Create new profile collection.
      setDoc(doc(database, DataCollection.Profile, unicID), {
        firstName: info.firstName,
        lastName: info.lastName || "",
        avatarParams: {
          url: "",
          bgAvatar: info.avatarParams?.bgAvatar
        },
        about: "",
        phone: "",
      })
      .then(() => resolve())
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false));
    })
  };
  const updateUserInfo = async(data: IUserInfo): Promise<void> => {
    const unicID = data.uid as string; // Unic id for database field access.
    const profileRef = doc(database, DataCollection.Profile, unicID);

    const { 
      firstName, 
      lastName, 
      avatarParams, 
      photoFile, 
      about, 
      phone 
    }: IUserInfo = data;

    const fieldsToUpdate: IUserFieldsUpdate = {
      firstName,
      lastName,
      avatarParams: {
        url: avatarParams.url,
        bgAvatar: userInfo.value.avatarParams.bgAvatar
      },
      about,
      phone,
    }

    commonStore.setLoadingStatus(true);
    // New upload image.
    if (photoFile !== null) 
    {
      await (updateUserAvatar(photoFile, unicID) as Promise<string>)
      .then((photo: string) => {
        if(fieldsToUpdate.avatarParams) {
          fieldsToUpdate.avatarParams.url = photo;
        }
      })
    }
    // Photo has been removed.
    else if(!avatarParams.url && userInfo.value.avatarParams.url) { 
      await deleteUserAvatar(unicID).then(() => {
        if (fieldsToUpdate.avatarParams) {
          fieldsToUpdate.avatarParams.url = "";
        }
      })
    }

    return new Promise((resolve, reject) => {
      updateDoc(profileRef, fieldsToUpdate).then(() => {
        getUserProfile(unicID).then(() => resolve())
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        commonStore.setLoadingStatus(false);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false))
    })
  };
  const deleteUserProfile = (unicID: string): Promise<void> => {
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      const deleteUserProfile = doc(database, DataCollection.Profile, unicID);
      const currentUserAvatar = userInfo.value.avatarParams.url;

      deleteDoc(deleteUserProfile).then(() => {
        if (currentUserAvatar) {
          deleteUserAvatar(unicID)
        }
        notificationStore.deleteNotificationList(unicID);
        configurationStore.deleteUserConfiguration(unicID);
        resolve();
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false));
    })
  };
  const getUserProfile = (unicID: string): Promise<IUserCreated> => {
    // Profile document by unicID in database. 
    const profileRef = doc(database, DataCollection.Profile, unicID);

    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      // Get profile info.
      getDoc(profileRef).then(async(response) => {
        const info = response.data() as IUserCreated;
        if (info) {
          // Get user avatar.
          if (info.avatarParams.url) {
            await getUserAvatar(unicID)
            .then((photo: string) => info.avatarParams.url = photo);
          }
          setUserInfo(info);
          resolve(info);
        }
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false))
    })
  };
  const updateUserAvatar = (file: File | null, unicID: string): Promise<string> | IPictureParams => {
    if (!file) return userInfo.value.avatarParams;

    const storageRef = Refference(storage, unicID);
    return new Promise((resolve, reject) => {
      uploadBytes(storageRef, file)
      .then(() => {
        // Get image url after upload.
        getUserAvatar(unicID).then((url: string) => resolve(url))
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error);
      })
    })
  };
  const updateUserBackgroundAvatar = (bgAvatar: string, unicID: string): Promise<void> => {
    const profileRef = doc(database, DataCollection.Profile, unicID);
    
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      updateDoc(profileRef, {
        avatarParams: {
          url: userInfo.value.avatarParams.url,
          bgAvatar: bgAvatar,
        }
      }).then(() => {
        resolve();
        setBackgroundAvatar(bgAvatar);
      })
      .catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        commonStore.setLoadingStatus(false);
        reject(error);
      })
      .finally(() => commonStore.setLoadingStatus(false))
    })
  };
  const getUserAvatar = (unicID: string): Promise<string> => {
    const storage = getStorage();
    const avatarRef = Refference(storage, unicID);
    return new Promise((resolve) => {
      getDownloadURL(avatarRef).then((avatarParams) => {
        resolve(avatarParams)
      })
    })
  };
  const deleteUserAvatar = (unicID: string): Promise<void> => {
    const deleteAvatarRef = Refference(storage, unicID);
    return new Promise((resolve, reject) => {
      deleteObject(deleteAvatarRef).then(() => {
        resolve();
      }).catch((error: ErrorCode) => {
        ShowErrorMessage(error);
        reject(error)
      })
    })
  };
  const userLogout = async(): Promise<void> => {
    return await getAuth().signOut().then(() => {
      setCurrentUser({});

      commonStore.setConfirmPopupVisibillity(false);

      setUserInfo({
        firstName: "",
        lastName: "",
        about: "",
        phone: "",
        avatarParams: {
          url: "",
          bgAvatar: ""
        }
      });
      // Set dark theme by default.
      SetTheme("dark");
      localStorage.removeItem("smartumTheme");

      if (!router.currentRoute.value.meta.notAuthorized) {
        router.push({ name: "SignIn" });
        localStorage.removeItem("smartumToken");
      }
    })
    .catch((error: ErrorCode) => notify({
        title: "Произошла ошибка!",
        text: String(error),
      })
    ).finally(() => commonStore.setLoadingStatus(false))
  }

  return {
    currentUser,
    userInfo,
    setCurrentUser,
    setUserInfo,
    setBackgroundAvatar,
    createUserProfile,
    updateUserInfo,
    deleteUserProfile,
    getUserProfile,
    updateUserAvatar,
    updateUserBackgroundAvatar,
    deleteUserAvatar,
    getUserAvatar,
    userLogout
  }
})

export default useUserStore;