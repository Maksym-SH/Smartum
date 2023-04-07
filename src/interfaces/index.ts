import { OmitUserInfo } from "@/types/index";

export interface IError {
  config?: object;
  status?: number;
  code?: number;
}

export interface ISelectElem {
  title: string;
  callback: () => void;
  icon?: string;
  variant?: "info" | string;
}

export interface ILanguage {
  eng: string;
  ru: string;
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

// Expansion panel.
export interface IExpPanelItem {
  title: string;
  icon?: string;
  callback: () => void;
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

// TimeStamp
export interface IFormatDate {
  time: string;
  date: string;
}

// File 
export interface FileResult {
  result: string;
  type: string;
}

//Router
export interface IMetaName {
  protected: boolean;
  tabName: ILanguage;
}
