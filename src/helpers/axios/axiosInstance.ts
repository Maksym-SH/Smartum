import axios, { AxiosInstance } from "axios";

import refreshUserInfo from "@/helpers/firebase/firebaseRefresh";

import { IError } from "@/interfaces";

export default function axiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  });
  instance.interceptors.response.use(
    (response) => response,
    (error: IError) => {
      const { status } = error;
      if (status === 401) refreshUserInfo();
    }
  );

  return instance;
}
