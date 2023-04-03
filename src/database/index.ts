import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore"; 
import { database } from "@/main";
import { IUserInfo } from "@/interfaces";
import { User } from "firebase/auth";
import store from "@/store";
import { IUserFieldsUpdate } from "@/types";

export const CreateUserAdditional = async({ uid }: User): Promise<any> => {
  store.dispatch("setLoadingStatus", true)

  await setDoc(doc(database, "profile", uid), {
    about: "",
    photoURL: "",
    phone: "",
  }).finally(() => store.dispatch("setLoadingStatus", false));
}

export const ProfileUpdateAdditional = async(data: IUserInfo, { uid }: User, 
                                                  imgChanged: boolean): Promise<any> => {

  const profile = doc(database, "profile", uid);
  const { about, photoURL, phone } = data;

  const fieldsToUpdate: IUserFieldsUpdate = {
    about,
    phone,
  }

  if(imgChanged) {
    fieldsToUpdate.photoURL = photoURL;
  }

  store.dispatch("setLoadingStatus", true);
  await updateDoc(profile, fieldsToUpdate).then(() => GetUserInfo())
  .catch(() => store.dispatch("setLoadingStatus", false));
}

export const GetUserInfo = async(): Promise<any> => {
  const unicID = store.getters.getCurrentUser.uid;
  const docRef = doc(database, "profile", unicID);

  store.dispatch("setLoadingStatus", true);
  const getUser = await getDoc(docRef)
  .finally(() => store.dispatch("setLoadingStatus", false))

  store.dispatch("setAdditionalParamsUser", getUser.data())
}