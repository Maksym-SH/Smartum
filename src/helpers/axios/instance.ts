import axios from 'axios';
import { notify } from '@kyvg/vue3-notification';
import { getAuth } from 'firebase/auth';
import { IError } from '@/interfaces/interfaces';
import store from '@/store';

export default function axiosInstance(): object {
  const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL
  });
  instance.interceptors.response.use(
    (response) => response,
    (error: IError) => {
    const { status } = error;
    if (status === 401) {
      getAuth().onAuthStateChanged((user) => {
        if (user) {
            const auth: any = getAuth();
  
            auth.currentUser.getIdToken(true)
              .then(async (response: string) => {
                store.dispatch("setUserToken", response);
              })
              .catch((error: string) =>{
                  notify({
                    title: "Ошибка",
                    type: "error",
                    text: error
                  })
              });
        }
        else {
          if (getAuth().currentUser) getAuth().signOut();
        }
      });
    }
  })

  return instance;
}