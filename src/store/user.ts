import router from "@/router";
import ShowErrorMessage from "@/helpers/firebase/firebaseErrorMessage";
import { ActionContext } from "vuex"
import { getAuth } from "firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { IUserCreated, IUserInfo, IUserState, ICreateUser } from "@/interfaces";
import { ErrorCode, IUserFieldsUpdate, UserContext } from "@/types"; 
import { doc, updateDoc, setDoc, getDoc, deleteDoc } from "firebase/firestore"; 
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
      photoURL: ""
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

      return new Promise((resolve, reject) => {
        setDoc(doc(database, DataCollection.Profile, info.uid), {
            firstName: info.firstName,
            lastName: info.lastName || "",
            about: "",
            phone: "",
        })
        .then((): Awaited<void> => {
          // Set nullable photoURL.
          setDoc(doc(database, DataCollection.Photo, info.uid), {
            photoURL: ""
          }).finally(() => resolve())
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false));
      })
    },
    updateUserInfo({ dispatch }: UserContext<IUserInfo>, info: Required<IUserCreated>): Promise<void> {

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

        return new Promise((resolve, reject) => {
          updateDoc(profile, fieldsToUpdate).then(() => {
            updateDoc(profilePhoto, "photoURL", photoURL).then(() => {
              resolve();
            }).finally(() => dispatch("getUserInfo"))
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            dispatch("setLoadingStatus", false);
            reject(error);
          })
          .finally(() => dispatch("setLoadingStatus", false))
        })
    },
    deleteUserInfo({ dispatch }: UserContext<IUserInfo>, uid: string): Promise<void> {
      dispatch("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        const deleteUserProfile = doc(database, DataCollection.Profile, uid);
        const deleteUserAvatar = doc(database, DataCollection.Photo, uid);

        deleteDoc(deleteUserProfile).then(() => {
          deleteDoc(deleteUserAvatar).finally(() => resolve())
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
        
        const profileRef = doc(database, DataCollection.Profile, unicID); // Profile document by unicID in database. 

        dispatch("setLoadingStatus", true);

        return new Promise((resolve, reject) => {
          //Get profile info.
          getDoc(profileRef).then(async(response) => {
            const info = response.data();
            // Get user avatar.
            await dispatch("getUserAvatar", unicID).then((photo: string) => {
              if (info) info.photoURL = photo;
            })

            commit("SET_USER_INFO", info);
            resolve(info);
          })
          .catch((error: ErrorCode) => {
            ShowErrorMessage(error);
            reject(error);
          })
          .finally(() => dispatch("setLoadingStatus", false))
        })
    },
    getUserAvatar({ dispatch }: UserContext<IUserInfo>, unicID: string): Promise<any> {
      const avatarProfileRef = doc(database, DataCollection.Photo, unicID); // Unic id for database field access.
      dispatch("setLoadingStatus", true);

      return new Promise((resolve, reject) => {
        // Get user avatar.
        getDoc(avatarProfileRef).then((response) => {
          const photoURL = response.data()?.photoURL || "";
          resolve(photoURL);
        })
        .catch((error: ErrorCode) => {
          ShowErrorMessage(error);
          reject(error);
        })
        .finally(() => dispatch("setLoadingStatus", false))
      })
    },
    userLogout({ commit }: UserContext<IUserState>): Awaited<void> {
      getAuth().signOut().then(() => {
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
      .catch((error: ErrorCode) => notify({
          title: "Произошла ошибка!",
          text: String(error),
        })
      )
    },
  },
}
