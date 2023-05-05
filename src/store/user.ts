import { getAuth, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { 
  IUserCreated, 
  IUserState, 
  ICreateUser, 
  IAvatarUpdate, 
  IPictureParams, 
  IUpdatePictureBG 
} from "@/interfaces";

import { ErrorCode, IUserFieldsUpdate, ModuleCtx } from "@/types"; 
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { database } from "@/helpers/firebase/firebaseInitialize";
import { DataCollection } from "@/enums";
import { SetTheme } from "@/helpers/methods";

import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";

export default {
  state: {
    currentUser: {},
    userInfo: {
      firstName: "",
      lastName: "",
      about: "",
      phone: "",
      avatarParams: {
        url: "",
        bgAvatar: ""
      }
    }
  },
  mutations: {
    setCurrentUser(state: IUserState, user: User): void {
      state.currentUser = user;
    },
    setUserInfo(state: IUserState, params: IUserCreated): void {
      state.userInfo = params;
    },
    setBackgroundAvatar(state: IUserState, background: string): void {
      state.userInfo.avatarParams.bgAvatar = background;
    }
  },
  actions: {
    createUserProfile({ commit }: ModuleCtx<IUserState>, info: ICreateUser): Promise<void> {
      const unicID = info.uid; // Unic id for database field access.

      commit("setLoadingStatus", true)
      return new Promise((resolve, reject) => {
        // Create new profile collection.
        setDoc(doc(database, DataCollection.Profile, unicID), {
            firstName: info.firstName,
            lastName: info.lastName || "",
            avatarParams: {
              url: "",
              bgAvatar: info.avatarParams.bgAvatar
            },
            about: "",
            phone: "",
        })
        .then(() => resolve())
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false));
      })
    },
    async updateUserInfo({ state, commit, dispatch }: ModuleCtx<IUserState>,
                                                   data: Required<IUserCreated>): Promise<void> {
      const unicID = data.uid; // Unic id for database field access.
      const profileRef = doc(database, DataCollection.Profile, unicID);

      const { firstName, lastName, avatarParams, photoFile, about, phone }: IUserCreated = data;

      const fieldsToUpdate: IUserFieldsUpdate = {
        firstName,
        lastName,
        avatarParams: {
          url: avatarParams.url,
          bgAvatar: state.userInfo.avatarParams.bgAvatar
        },
        about,
        phone,
      }

      commit("setLoadingStatus", true);

      // New upload image.
      if (photoFile !== null) 
      {
        await dispatch("updateUserAvatar", {
          file: photoFile,
          uid: unicID
        }).then((photo) => {
          if(fieldsToUpdate.avatarParams) {
            fieldsToUpdate.avatarParams.url = photo;
          }
        })
      }
      // Photo has been removed.
      else if(!avatarParams.url && state.userInfo.avatarParams.url) { 
        await dispatch("deleteUserAvatar", unicID)
        .then(() => {
          if (fieldsToUpdate.avatarParams) {
            fieldsToUpdate.avatarParams.url = "";
          }
        })
      }

      return new Promise((resolve, reject) => {
        updateDoc(profileRef, fieldsToUpdate).then(() => {
          dispatch("getUserProfile").then(() => resolve())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          commit("setLoadingStatus", false);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    deleteUserProfile({ state, dispatch, commit }: ModuleCtx<IUserState>, unicID: string): Promise<void> {
      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        const deleteUserProfile = doc(database, DataCollection.Profile, unicID);
        const currentUserAvatar = state.userInfo.avatarParams.url;

        deleteDoc(deleteUserProfile).then(() => {
          if (currentUserAvatar) {
            dispatch("deleteUserAvatar", unicID)
          }
          dispatch("deleteNotificationList", unicID)
          dispatch("deleteUserConfiguration", unicID);
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false));
      })
    },
    getUserProfile({ state, commit, dispatch }: ModuleCtx<IUserState>): Promise<any> {
      const unicID = state.currentUser!.uid; // Unic id for database field access.

      // Profile document by unicID in database. 
      const profileRef = doc(database, DataCollection.Profile, unicID);

      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        // Get profile info.
        getDoc(profileRef).then(async(response) => {
          const info = response.data();
          if (info) {
            // Get user avatar.
            if (info.avatarParams.url) {
              await dispatch("getUserAvatar", unicID)
              .then((photo: string) => info.avatarParams.url = photo);
            }
            commit("setUserInfo", info);
            resolve(info);
          }
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    updateUserAvatar({ state, dispatch }: ModuleCtx<IUserState>, info: IAvatarUpdate):
                                                                     Promise<string> | IPictureParams {
      if (!info.file) return state.userInfo.avatarParams;

      const unicID = state.currentUser.uid; // Unic id for database field access.

      const storage = getStorage();
      const storageRef = ref(storage, unicID);
      return new Promise((resolve, reject) => {
        if (info.file) {
          uploadBytes(storageRef, info.file)
          .then(() => {
            // Get image url after upload.
            dispatch("getUserAvatar", unicID).then((url) => resolve(url))
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
        }
      })
    },
    updateUserBackgroundAvatar({ state, commit }: ModuleCtx<IUserState>, info: IUpdatePictureBG): Promise<void> {
      const profileRef = doc(database, DataCollection.Profile, info.unicID);
      
      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        updateDoc(profileRef, {
          avatarParams: {
            url: state.userInfo.avatarParams.url,
            bgAvatar: info.bgAvatar,
          }
        }).then(() => {
          resolve();
          commit("setBackgroundAvatar", info.bgAvatar);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          commit("setLoadingStatus", false);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    deleteUserAvatar(_: any, unicID: string): Promise<void> {
      const storage = getStorage();
      const deleteAvatarRef = ref(storage, unicID);
      return new Promise((resolve, reject) => {
        deleteObject(deleteAvatarRef).then(() => {
          resolve();
        }).catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error)
        })
      })
    },
    getUserAvatar(_: any, unicID: string): Promise<string> {
      const storage = getStorage();
      const avatarRef = ref(storage, unicID);
      return new Promise((resolve) => {
        getDownloadURL(avatarRef).then((avatarParams) => {
          resolve(avatarParams)
        })
      })
    },
    userLogout({ commit }: ModuleCtx<IUserState>): Awaited<void> {
      getAuth().signOut().then(() => {
        commit("setCurrentUser", {});
        commit("setConfirmPopup", false);
        commit("setUserInfo", {
          firstName: "",
          lastName: "",
          about: "",
          phone: "",
          avatarParams: ""
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
      ).finally(() => commit("setLoadingStatus", false))
    },
  },
}
