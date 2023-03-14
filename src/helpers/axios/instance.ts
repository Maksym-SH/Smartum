import axios from "axios";
import { IError } from "@/interfaces/index";
import RefreshToken from "@/helpers/firebase/firebaseRefresh";

export default function axiosInstance(): object {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
  });
  instance.interceptors.response.use(
    (response) => response,
    (error: IError) => {
      const { status } = error;
      if (status === 401) RefreshToken();
    }
  );

  return instance;
}
