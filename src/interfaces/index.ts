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

// Store
export interface IUserStore {
  userToken: string;
  currentUser: object;
}
export interface ICommonStore {
  loadingStatus: boolean;
}
// TimeStamp
export interface IFormatDate {
  time: string,
  date: string,
}