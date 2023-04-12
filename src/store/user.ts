import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, IUserInfo, IUserState, ICreateUser, IAvatarUpdate } from "@/interfaces";
import { ErrorCode, IUserFieldsUpdate, UserContext } from "@/types"; 
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; 
import { database } from "@/main";
import { DataCollection } from "@/enums";

export default {
  state: {
    userToken: "",
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
  getters: {
    getUserToken(state: IUserState): string {
      return state.userToken;
    },
    getCurrentUser(state: IUserState): object {
      return state.currentUser;
    },
    getUserInfo(state: IUserState): IUserCreated {
      return state.userInfo;
    }
  },
  mutations: {
    SET_USER_TOKEN(state: IUserState, token: string): void {
      state.userToken = token;
    },
    SET_CURRENT_USER(state: IUserState, user: object): void {
      state.currentUser = user;
    },
    SET_USER_INFO(state: IUserState, params: IUserCreated): void {
      state.userInfo = params;
    },
  },
  actions: {
    setUserToken({ commit }: UserContext<IUserState>, token: string): void {
      commit("SET_USER_TOKEN", token);
    },
    setCurrentUser({ commit }: UserContext<IUserState>, user: any): void {
      commit("SET_CURRENT_USER", user);
    },
    createUser({ dispatch }: UserContext<IUserState>, info: ICreateUser): Promise<void> {
      dispatch("setLoadingStatus", true)
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
        .finally(() => dispatch("setLoadingStatus", false));
      })
    },
    async updateUserInfo({ getters, dispatch }: UserContext<IUserInfo>,
                                                   data: Required<IUserCreated>): Promise<void> {
      const unicID = data.uid; // Unic id for database field access.
      const profileRef = doc(database, DataCollection.Profile, unicID);

      const { firstName, lastName, avatarParams, photoFile, about, phone }: IUserCreated = data;

      const fieldsToUpdate: IUserFieldsUpdate = {
        firstName,
        lastName,
        avatarParams: {
          url: avatarParams.url,
          bgAvatar: getters.getUserInfo.avatarParams.bgAvatar
        },
        about,
        phone,
      }

      dispatch("setLoadingStatus", true);

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
      else if(!avatarParams.url && getters.getUserInfo.avatarParams.url) { 
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
          dispatch("setLoadingStatus", false);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })
    },
    deleteUserInfo({ dispatch, getters }: UserContext<IUserInfo>, unicID: string): Promise<void> {
      dispatch("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        const deleteUserProfile = doc(database, DataCollection.Profile, unicID);
        const currentUserAvatar = getters.getUserInfo.avatarParams.url;

        deleteDoc(deleteUserProfile).then(() => {
          if (currentUserAvatar) {
            dispatch("deleteUserAvatar", unicID)
          }
          resolve();
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false));
      })
    },
    getUserInfo({ getters, commit, dispatch }: UserContext<IUserInfo>): Promise<any> {
      const unicID = getters.getCurrentUser.uid; // Unic id for database field access.

      // Profile document by unicID in database. 
      const profileRef = doc(database, DataCollection.Profile, unicID);

      dispatch("setLoadingStatus", true);

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

            commit("SET_USER_INFO", info);
            resolve(info);
          }
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })
    },
    updateUserAvatar({ getters, dispatch }: UserContext<IUserInfo>, info: IAvatarUpdate): Promise<string> {
      if (!info.file) return getters.getUserInfo.avatarParams;

      const unicID = getters.getCurrentUser.uid; // Unic id for database field access.

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
    deleteUserAvatar(context: UserContext<IUserInfo>, unicID: string): Promise<void> {
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
    getUserAvatar(context: UserContext<IUserInfo>, unicID: string): Promise<string> {
      const storage = getStorage();
      const avatarRef = ref(storage, unicID);
      return new Promise((resolve) => {
        getDownloadURL(avatarRef).then((avatarParams) => {
          resolve(avatarParams)
        })
      })
    },
    userLogout({ commit }: UserContext<IUserState>): Awaited<void> {
      getAuth().signOut().then(() => {
        console.log('then')
        commit("SET_USER_TOKEN", "");
        commit("SET_CURRENT_USER", {});
        commit("SET_CONFIRM_POPUP", false);
        commit("SET_USER_INFO", {
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
      )
    },
  },
}
