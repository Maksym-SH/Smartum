import { IPopupParams } from "@/interfaces";
import { getAuth } from "@firebase/auth";
import store from "@/store";

export const ObjectFull = (object: object): boolean => {
  return Object.values(object).every((item) => item);
}
export const ObjectHasValues = (object: object): boolean => {
  return Object.values(object).some((item) => item);
}

export const ObjectNotEmpty = (object: object): boolean => {
  return Object.keys(object).length > 0;
}

export const OpenPopup = (params: IPopupParams): void => { 
  store.dispatch("setPopupParams", params);
}

// Random light color generation.
export const RandomHSLA = () => {
  return `hsl(${Math.round(360 * Math.random())}, 45%,  45%)`;
}

let ConfirmCallback: Function;
export const Confirmation = (toggle: boolean, callback?: Function | void): Promise<any> | void => {
  store.dispatch("setConfirmPopup", toggle);
  if (callback && toggle) {
    ConfirmCallback = callback;
  } 
  else return new Promise((resolve) => {
    resolve(ConfirmCallback());
  })
}

export const DeleteAccountPopup = (uid: string, params?: Partial<IPopupParams>): Function => {
  const userUID: string = uid;
  const popupParams: Partial<IPopupParams> | null = params ?? null;
  return function() {
    OpenPopup({
      title: popupParams?.title || "Удалить аккаунт?",
      text: popupParams?.text || "Это действие необратимо!",
      buttons: {
        yes: {
          text: "Удалить аккаунт",
          variant: "danger"
        },
      },
      callback: (): void => {
        store.dispatch("deleteUserInfo", userUID).then(() => {
          getAuth().currentUser?.delete()
          .then(() => {
            store.dispatch("userLogout");
          });
        })
      }
    });
  }
}