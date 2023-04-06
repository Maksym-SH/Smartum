import { ActionContext } from "vuex";
import router from "@/router";
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, IUserInfo, IUserStore, ICreateUser } from "@/interfaces";
import { IUserFieldsUpdate } from "@/types";
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore"; 
import { database } from "@/main";
import store from "@/store";
import { DataCollection } from "@/enums/";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";

export default {
  state: {
    userToken: "",
    currentUser: {},
    openConfirmPopup: false,
    userInfo: {
      firstName: "",
      lastName: "",
      about: "",
      phone: "",
      photoURL: ""
    }
  },
  getters: {
    getUserToken(state: IUserStore): string {
      return state.userToken;
    },
    getCurrentUser(state: IUserStore): object {
      return state.currentUser;
    },
    getConfirmPopup(state: IUserStore): boolean {
      return state.openConfirmPopup;
    },
    getUserInfo(state: IUserStore): IUserCreated {
      return state.userInfo;
    }
  },
  mutations: {
    SET_USER_TOKEN(state: IUserStore, token: string): void {
      state.userToken = token;
    },
    SET_CURRENT_USER(state: IUserStore, user: object): void {
      state.currentUser = user;
    },
    SET_CONFIRM_POPUP(state:IUserStore, show: boolean): void {
      state.openConfirmPopup = show;
    },
    SET_USER_INFO(state: IUserStore, params: IUserCreated): void {
      state.userInfo = params;
    },
  },
  actions: {
    setUserToken({ commit }: ActionContext<IUserStore, any>, token: string): void {
      commit("SET_USER_TOKEN", token);
    },
    setCurrentUser({ commit }: ActionContext<IUserStore, any>, user: any): void {
      commit("SET_CURRENT_USER", user);
    },
    setConfirmPopup({ commit }: ActionContext<IUserStore, any>, show: boolean): void {
      commit('SET_CONFIRM_POPUP', show);
    },
    createUser({ dispatch }: ActionContext<IUserStore, any>, info: ICreateUser): Promise<void> {
      dispatch("setLoadingStatus", true)

      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Profile, info.uid), {
            firstName: info.firstName,
            lastName: info.lastName || "",
            about: "",
            phone: "",
        })
        .then((): void => {
          // Set nullable photoURL.
          setDoc(doc(database, DataCollection.Photo, info.uid), {
            photoURL: ""
          }).finally((): void => resolve())
        })
        .catch((error): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => store.dispatch("setLoadingStatus", false));
      })
    },
    updateUserInfo({ dispatch }: ActionContext<IUserInfo, any>, 
                                                    info: Required<IUserCreated>): Promise<void> {

        const profile = doc(database, DataCollection.Profile, info.uid);
        const profilePhoto = doc(database, DataCollection.Photo, info.uid);
      
        const { firstName, lastName, about, photoURL, phone }: IUserCreated = info;
      
        const fieldsToUpdate: IUserFieldsUpdate = {
          firstName,
          lastName,
          about,
          phone,
        }
        dispatch("setLoadingStatus", true);

        return new Promise((resolve, reject): void => {
          updateDoc(profile, fieldsToUpdate).then((): void => {
            updateDoc(profilePhoto, "photoURL", photoURL).then((): void => {
              resolve();
            }).finally((): Promise<any> => dispatch("getUserInfo"))
          })
          .catch((error): void => {
            ShowErrorMessage(error);
            dispatch("setLoadingStatus", false);
            reject(error);
          })
          .finally((): Promise<any> => dispatch("setLoadingStatus", false))
        })
    },
    deleteUserInfo({ dispatch }: ActionContext<IUserInfo, any>, uid: string): Promise<void> {
      dispatch("setLoadingStatus", true);

      return new Promise((resolve, reject): void => {
        const deleteUserProfile = doc(database, DataCollection.Profile, uid);
        const deleteUserAvatar = doc(database, DataCollection.Photo, uid);

        deleteDoc(deleteUserProfile).then((): void => {
          deleteDoc(deleteUserAvatar).finally((): void => resolve())
        })
        .catch((error): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false));
      })
    },

    getUserInfo({ getters, commit, dispatch }: ActionContext<IUserInfo, any>): Promise<any> {
        const unicID = getters.getCurrentUser.uid; // Unic id for database field access.
        
        const profileRef = doc(database, DataCollection.Profile, unicID); // Profile document by unicID in database. 

        store.dispatch("setLoadingStatus", true);

        return new Promise((resolve, reject): void => {
          //Get profile info.
          getDoc(profileRef).then(async(response): Promise<any> => {
            const info = response.data();
            // Get user avatar.
            await dispatch("getUserAvatar", unicID).then((photo): void => {
              if (info) info.photoURL = photo;
            })

            commit("SET_USER_INFO", info);
            resolve(info);
          })
          .catch((error): void => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally((): Promise<any> => dispatch("setLoadingStatus", false))
        })
    },
    getUserAvatar({ dispatch }: ActionContext<IUserInfo, any>, unicID: string): Promise<any> {
      const avatarProfileRef = doc(database, DataCollection.Photo, unicID); // Unic id for database field access.
      dispatch("setLoadingStatus", true);

      return new Promise((resolve, reject): void => {
        // Get user avatar.
        getDoc(avatarProfileRef).then((response): void => {
          const photoURL = response.data()?.photoURL || "";
          resolve(photoURL);
        })
        .catch((error): void => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally((): Promise<any> => dispatch("setLoadingStatus", false))
      })
    },

    userLogout({ commit }: ActionContext<IUserStore, any>): void {
      getAuth().signOut().then((): void => {
        commit("SET_USER_TOKEN", "");
        commit("SET_CURRENT_USER", {});
        commit("SET_CONFIRM_POPUP", false);
        commit("SET_USER_INFO", {
          firstName: "",
          lastName: "",
          about: "",
          phone: "",
          photoURL: ""
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
      .catch((error): void => 
        notify({
          title: "Произошла ошибка!",
          text: error,
        })
      )
    },
  },
}
