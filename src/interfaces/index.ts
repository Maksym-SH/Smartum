import { OmitUserInfo } from "@/types/index";
import { User, EmailAuthCredential, UserCredential } from "firebase/auth";

// Components
export interface ISelectElem {
  title: string;
  callback: () => void;
  icon?: string;
  variant?: "info" | string;
}
export interface IExpPanelItem {
  title: string;
  icon?: string;
  callback: () => void;
}
export interface IPopupParams {
  title?: string;
  text?: string;
  buttons: {
    no?: {
      variant?: string;
      text?: string;
    },
    yes: {
      variant?: string;
      text?: string;
    }
  },
  callback: () => any
}
export interface ILanguage {
  eng: string;
  ru: string;
}
export interface FileResult {
  result: string;
  type: string;
}
export interface IDateFormat {
  time: string;
  date: string;
}
// User
export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserReg extends IUserLogin {
  firstName: string;
  lastName: string;
}
export interface IUserAuth {
  signUp: (userData: IUserReg, validate: boolean) => void;
  signIn: (userData: IUserLogin, validate: boolean) => void;
  reauthorization: (userInfo: User, credential: EmailAuthCredential) => Promise<UserCredential>;
}
export interface IUserResponse {
  accessToken?: string,
  displayName: string | null
}
export interface IUserInfo extends Omit<IUserReg, "password"> {
  firstName: string;
  lastName: string;
  phone: string;
  about: string;
  photoURL: string;
  emailVerified?: boolean;
  newPassword: string;
}
export interface ICreateUser extends Omit<IUserInfo, OmitUserInfo> {
  uid: string,
}

// Response
export interface IError {
  config?: object;
  status?: number;
  code?: number;
}

// Store
export interface IUserState {
  userToken: string;
  currentUser: object;
  userPhoto: string;
  openConfirmPopup: boolean;
  userInfo: IUserCreated;
}
export interface IUserCreated {
  firstName: string;
  lastName?: string;
  about: string;
  phone: string;
  photoURL: string;
  uid?: string;
}
export interface IRootState {
  loadingStatus: boolean;
  popupParams: IPopupParams | {};
  openConfirmPopup: boolean,
}

//Router
export interface IMetaName {
  protected: boolean;
  tabName: ILanguage;
}