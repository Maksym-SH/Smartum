import { ApiMethod } from "@/types/index";

export interface IError {
  config?: object;
  status?: number;
  code?: number;
}

export interface IAxiosData {
  url: string;
  data: any;
  method: ApiMethod;
  auth?: boolean;
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

// Expansion panel.
export interface IExpPanelItem {
  title: string;
  icon?: string;
  callback: () => void;
}

// Store
export interface IUserStore {
  userToken: string;
  currentUser: object;
  userPhoto: string;
  openConfirmPopup: boolean;
  userInfo: IUserCreated
}

export interface IUserCreated {
  firstName: string,
  lastName?: string,
  about: string,
  phone: string,
  photoURL: string
}

export interface ICommonStore {
  loadingStatus: boolean;
  popupParams: boolean;
}

export interface IPopupParams {
  title?: string;
  text?: string;
  buttons: {
    no?: {
      variant?: string;
      text?: string;
    },
    yes?: {
      variant?: string;
      text?: string;
    }
  },
  callback: () => any
}

export interface IPopupButtons extends Omit<IPopupParams, "title" | "text" | "buttons" | "callback"> {
  yes: {
    variant?: string;
    text: string;
  },
  no: {
    variant?: string;
    text: string;
  }
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