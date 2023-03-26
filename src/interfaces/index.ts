import { ApiMethod } from "@/types/index";

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserReg extends IUserLogin {
  firstName: string;
  lastName: string;
}

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
export interface IUserAuth {
  signUp: (userData: IUserReg, validate: boolean) => void;
  signIn: (userData: IUserLogin, validate: boolean) => void;
}

// Store
export interface IUserStore {
  userToken: string;
  currentUser: object;
  userPhoto: string;
}

export interface ICommonStore {
  loadingStatus: boolean;
}

// TimeStamp
export interface IFormatDate {
  time: string,
  date: string,
}

// File 
export interface FileResult {
  result: string,
  type: string
}

//Router
export interface IMetaName {
  protected: boolean,
  tabName: ILanguage
}