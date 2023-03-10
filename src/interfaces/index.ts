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

export interface ISize {
  width: string;
  height: string;
}

export interface ISelectElem {
  title: string;
  callback: () => void;
}

// Store
export interface IUserStore {
  userToken: string;
  currentUser: object;
}
export interface ICommonStore {
  loadingStatus: boolean;
}
