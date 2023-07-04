import { defineStore } from "pinia";
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { database } from "@/helpers/firebase/firebaseInitialize";
import { SetTheme } from "@/helpers/methods";

import * as fs from "firebase/firestore";
import * as st from "firebase/storage";
import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import useStores from "@/composables/useStores";

import type * as userType from "@/types/interfaces/user";
import { DataCollection, Route } from "@/types/enums";
import type { User } from "firebase/auth";
import type { ErrorCode } from "@/types/types";

const useUserStore = defineStore("user", () => {
  const { commonStore, notificationStore, configurationStore, dashboardStore } = useStores();

  const storage = st.getStorage();

  const currentUser = ref<User | {}>({});

  const userInfo = ref<userType.IUserCreated>({
    firstName: "",
    lastName: "",
    about: "",
    phone: "",
    avatarParams: {
      url: "",
      bgAvatar: "",
    },
  });

  // Avatar settings.
  const setBackgroundAvatar = (background: string): void => {
    userInfo.value.avatarParams.bgAvatar = background;
  };

  const getAllUserAvatars = (): Promise<string[]> => {
    const storage = st.getStorage();

    const listAvatarsRef = st.ref(storage, import.meta.env.VITE_APP_ALL_AVATAR_PATH);

    return new Promise((resolve, reject) => {
      st.listAll(listAvatarsRef)
        .then((response) => {
          const promises = response.items.map((item) => st.getDownloadURL(item));

          Promise.all(promises).then((photos: string[]) => resolve(photos));
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };

  const getUserAvatar = (unicID: string): Promise<string> => {
    const avatarRef = st.ref(storage, unicID);

    return new Promise((resolve) => {
      st.getDownloadURL(avatarRef).then((avatarParams) => {
        resolve(avatarParams);
      });
    });
  };

  const updateUserAvatar = (
    file: File | null,
    unicID: string
  ): Promise<string> | userType.IPictureParams => {
    if (!file) return userInfo.value.avatarParams;

    const storageRef = st.ref(storage, unicID);
    return new Promise((resolve, reject) => {
      st.uploadBytes(storageRef, file)
        .then(() => {
          // Get image url after upload.
          getUserAvatar(unicID).then((url: string) => resolve(url));
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };

  const deleteUserAvatar = (unicID: string): Promise<void> => {
    const deleteAvatarRef = st.ref(storage, unicID);
    return new Promise((resolve, reject) => {
      st.deleteObject(deleteAvatarRef)
        .then(() => {
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };

  // User settings.
  const setCurrentUser = (user: User | {}): void => {
    currentUser.value = user;
  };

  const setUserInfo = (params: userType.IUserCreated): void => {
    userInfo.value = params;
  };

  const getUserProfile = (unicID: string): Promise<userType.IUserCreated> => {
    // Profile document by unicID in database.
    const profileRef = fs.doc(database, DataCollection.PROFILE, unicID);

    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      // Get profile info.
      fs.getDoc(profileRef)
        .then(async (response) => {
          const info = response.data() as userType.IUserCreated;
          if (info) {
            // Get user avatar.
            if (info.avatarParams.url) {
              await getUserAvatar(unicID).then(
                (photo: string) => (info.avatarParams.url = photo)
              );
            }
            setUserInfo(info);
            resolve(info);
          }
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  const createUserProfile = (info: Partial<userType.ICreateUser>): Promise<void> => {
    const unicID = info.uid as string; // Unic id for database field access.

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      // Create new profile collection.
      fs.setDoc(fs.doc(database, DataCollection.PROFILE, unicID), {
        firstName: info.firstName,
        lastName: info.lastName || "",
        avatarParams: {
          url: "",
          bgAvatar: info.avatarParams?.bgAvatar,
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
    });
  };

  // Other users
  const getUsersList = (
    loadPhotos?: boolean,
    showLoading = true
  ): Promise<userType.IUserForList[]> => {
    const userListRef = fs.doc(
      database,
      DataCollection.USERS,
      import.meta.env.VITE_APP_ALL_USER_COLLECTION
    );

    commonStore.setLoadingStatus(showLoading);

    return new Promise((resolve, reject) => {
      fs.getDoc(userListRef)
        .then((response) => {
          const usersList = response.data()?.collection as userType.IUserInfo[];

          if (loadPhotos) {
            getAllUserAvatars().then((list) => {
              usersList.map((user) => {
                return (user.avatarParams!.url =
                  list.find((item) => item.includes(user.uid as string)) || "");
              });
            });
          }

          resolve(usersList as userType.IUserForList[]);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(showLoading));
    });
  };

  const updateUsersList = (
    newUserInfo: Partial<userType.IUserForList> | string,
    deleteUser?: Boolean
  ): Promise<userType.IUserForList[]> => {
    const usersListRef = fs.doc(
      database,
      DataCollection.USERS,
      import.meta.env.VITE_APP_ALL_USER_COLLECTION
    );

    commonStore.setLoadingStatus(true);
    return new Promise((resolve, reject) => {
      getUsersList().then((usersList) => {
        if (usersList) {
          const userID = (newUserInfo as Partial<userType.IUserForList>).uid || newUserInfo;

          const foundUserIndex = usersList.findIndex((user) => user.uid === userID);

          // User was found.
          if (foundUserIndex !== -1) {
            // Delete user.
            if (typeof newUserInfo === "string" && deleteUser) {
              usersList.splice(foundUserIndex, 1);
            } else {
              // Update user info.
              usersList[foundUserIndex] = newUserInfo as userType.IUserForList;
            }
          }
          // Add new user.
          else if ((currentUser.value as User).emailVerified) {
            usersList.push(newUserInfo as userType.IUserForList);
          }

          fs.updateDoc(usersListRef, {
            collection: usersList,
          })
            .then(() => resolve(usersList))
            .catch((error: ErrorCode) => {
              ShowErrorMessage(error);
              reject(error);
            })
            .finally(() => commonStore.setLoadingStatus(false));
        }

        commonStore.setLoadingStatus(false);
      });
    });
  };

  const updateUserInfo = async (data: userType.IUserInfo): Promise<void> => {
    const unicID = data.uid as string; // Unic id for database field access.
    const profileRef = fs.doc(database, DataCollection.PROFILE, unicID);

    const { firstName, lastName, avatarParams, photoFile, about, phone }: userType.IUserInfo =
      data;

    const fieldsToUpdate: userType.IUserFieldsUpdate = {
      firstName,
      lastName,
      avatarParams: {
        url: avatarParams.url,
        bgAvatar: userInfo.value.avatarParams.bgAvatar,
      },
      about,
      phone,
    };

    commonStore.setLoadingStatus(true);
    // New upload image.
    if (photoFile !== null) {
      await (updateUserAvatar(photoFile, unicID) as Promise<string>).then((photo: string) => {
        if (fieldsToUpdate.avatarParams) fieldsToUpdate.avatarParams.url = photo;
      });
    }
    // Photo has been removed.
    else if (!avatarParams.url && userInfo.value.avatarParams.url) {
      await deleteUserAvatar(unicID).then(() => {
        if (fieldsToUpdate.avatarParams) fieldsToUpdate.avatarParams.url = "";
      });
    }
    return new Promise((resolve, reject) => {
      fs.updateDoc(profileRef, fieldsToUpdate)
        .then(() => {
          updateUsersList({ ...fieldsToUpdate, uid: unicID });
          getUserProfile(unicID).then(() => resolve());
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        });
    });
  };

  const deleteUserProfile = (unicID: string): Promise<void> => {
    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      const deleteUserProfile = fs.doc(database, DataCollection.PROFILE, unicID);
      const currentUserAvatar = userInfo.value.avatarParams.url;

      fs.deleteDoc(deleteUserProfile)
        .then(() => {
          if (currentUserAvatar) deleteUserAvatar(unicID);

          notificationStore.deleteNotificationList(unicID);
          configurationStore.deleteUserConfiguration(unicID);
          dashboardStore.deleteAllCodes(unicID);

          updateUsersList(unicID, true); // Delete user from list.

          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  const updateUserBackgroundAvatar = (bgAvatar: string, unicID: string): Promise<void> => {
    const profileRef = fs.doc(database, DataCollection.PROFILE, unicID);

    commonStore.setLoadingStatus(true);

    return new Promise((resolve, reject) => {
      fs.updateDoc(profileRef, {
        avatarParams: {
          url: userInfo.value.avatarParams.url,
          bgAvatar,
        },
      })
        .then(() => {
          resolve();
          setBackgroundAvatar(bgAvatar);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          commonStore.setLoadingStatus(false);
          reject(error);
        })
        .finally(() => commonStore.setLoadingStatus(false));
    });
  };

  const userLogout = async (): Promise<void> => {
    return await getAuth()
      .signOut()
      .then(() => {
        setCurrentUser({});

        commonStore.setConfirmPopupVisibillity(false);

        setUserInfo({
          firstName: "",
          lastName: "",
          about: "",
          phone: "",
          avatarParams: {
            url: "",
            bgAvatar: "",
          },
        });
        // Set dark theme by default.
        SetTheme("dark");
        localStorage.removeItem("smartumTheme");

        notificationStore.clearList(); // Clear any notifications.
        dashboardStore.clearList(); // Clear any boards.

        if (!router.currentRoute.value.meta.notAuthorized) {
          router.push({ name: Route.SIGN_IN });
          localStorage.removeItem("smartumToken");
        }
      })
      .catch((error: ErrorCode) => ShowErrorMessage(error))
      .finally(() => commonStore.setLoadingStatus(false));
  };

  return {
    currentUser,
    userInfo,
    getUsersList,
    setCurrentUser,
    setUserInfo,
    setBackgroundAvatar,
    createUserProfile,
    updateUserInfo,
    getAllUserAvatars,
    updateUsersList,
    deleteUserProfile,
    getUserProfile,
    updateUserAvatar,
    updateUserBackgroundAvatar,
    deleteUserAvatar,
    getUserAvatar,
    userLogout,
  };
});

export default useUserStore;
