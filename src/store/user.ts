import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { getAuth, User } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, IUserState, ICreateUser, IAvatarUpdate, IPictureParams } from "@/interfaces";
import { ErrorCode, IUserFieldsUpdate, ModuleCtx } from "@/types"; 
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { database } from "@/main";
import { DataCollection } from "@/enums";

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
  },
  actions: {
    createUser({ commit }: ModuleCtx<IUserState>, info: ICreateUser): Promise<void> {
      commit("setLoadingStatus", true)
      return new Promise((_, reject) => {
        setDoc(doc(database, DataCollection.Profile, info.uid), {
            firstName: info.firstName,
            lastName: info.lastName || "",
            avatarParams: {
              url: "",
              bgAvatar: info.avatarParams.bgAvatar
            },
            about: "",
            phone: "",
        })
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
          dispatch("getUserInfo").then(() => resolve())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          commit("setLoadingStatus", false);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false))
      })
    },
    deleteUserInfo({ state, dispatch, commit }: ModuleCtx<IUserState>, unicID: string): Promise<void> {
      commit("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        const deleteUserProfile = doc(database, DataCollection.Profile, unicID);
        const currentUserAvatar = state.userInfo.avatarParams.url;

        deleteDoc(deleteUserProfile).then(() => {
          if (currentUserAvatar) {
            dispatch("deleteUserAvatar", unicID)
          }
          dispatch("deleleNotificationList", unicID)
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => commit("setLoadingStatus", false));
      })
    },
    getUserInfo({ state, commit, dispatch }: ModuleCtx<IUserState>): Promise<any> {
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
    deleteUserAvatar(context: ModuleCtx<IUserState>, unicID: string): Promise<void> {
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
    getUserAvatar(context: ModuleCtx<IUserState>, unicID: string): Promise<string> {
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

        if (!router.currentRoute.value.meta.notAuthorized) {
          router.push({ name: "SignIn" });
          localStorage.removeItem("smartumToken");

          notify({
            text: "До скорого!",
            type: "success",
            ignoreDuplicates: true
          });
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
