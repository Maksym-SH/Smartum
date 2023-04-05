import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore"; 
import { database } from "@/main";
import { IUserInfo } from "@/interfaces";
import { User } from "firebase/auth";
import store from "@/store";
import { IUserFieldsUpdate } from "@/types";

export const CreateUser = async({ uid }: User, firstName:string, lastName?:string): Promise<any> => {
  store.dispatch("setLoadingStatus", true)

  await setDoc(doc(database, "profile", uid), {
    firstName: firstName,
    lastName: lastName || "",
    about: "",
    phone: "",
  })
  .then(() => setDoc(doc(database, "photos", uid), {
    photoURL: ""
  }))
  .finally(() => store.dispatch("setLoadingStatus", false));
}

export const UserUpdate = async(data: IUserInfo, { uid }: User): Promise<any> => {

  const profile = doc(database, "profile", uid);
  const profilePhoto = doc(database, "photos", uid);

  const { firstName, lastName, about, photoURL, phone } = data;

  const fieldsToUpdate: IUserFieldsUpdate = {
    firstName,
    lastName,
    about,
    phone,
  }
  store.dispatch("setLoadingStatus", true);
  await updateDoc(profile, fieldsToUpdate).then(() => {
    updateDoc(profilePhoto, "photoURL", photoURL).then(() => GetUserInfo())
  })
  .catch(() => store.dispatch("setLoadingStatus", false));
}


export const GetUserInfo = async(): Promise<any> => {
  const unicID = store.getters.getCurrentUser.uid;

  const profileRef = doc(database, "profile", unicID);
  const avatarProfileRef = doc(database, "photos", unicID);

  store.dispatch("setLoadingStatus", true);

  const getUser = await getDoc(profileRef)
  const getAvatar = await getDoc(avatarProfileRef);

  const userInfo = {...getUser.data(), photoURL: getAvatar.data()?.photoURL || "" };

  store.dispatch("setUserInfo", userInfo);
  store.dispatch("setLoadingStatus", false);

}