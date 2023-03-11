import { ApiMethod } from "@/types/index";

export interface IUser {
  email: string,
  password: string,
  repeatPassword?: string,
}

export interface IError {
  config?: object,
  status?: number,
  code?: number,
}

export interface IAxiosData {
  url: string,
  data: any,
  method: ApiMethod,
  auth?: boolean
}

export interface ISize 
{
  width: string,
  height: string
}