import { IPopupParams } from "@/interfaces";
import { getAuth } from "@firebase/auth";
import { Theme } from "@/types";

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

export const NewObjectLink = <Type>(object: Type): Type => {
  return JSON.parse(JSON.stringify(object));
}

export const OpenPopup = (params: IPopupParams): void => { 
  store.commit("setPopupParams", params);
}

export const SetTheme = (theme: Theme): void => {
  document.body.setAttribute("data-theme", theme);
}

// Random light color generation.
export const GenerateLightColorHexFormat = (): string => {
  // Generate random values for RGB components.
  const r = Math.floor(Math.random() * 128) + 128;
  const g = Math.floor(Math.random() * 128) + 128;
  const b = Math.floor(Math.random() * 128) + 128;

  const colorHex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

  return colorHex;
  
   // Helper function to convert component values to HEX.
  function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
}

let ConfirmCallback: Function;
export const Confirmation = (toggle: boolean, callback?: Function | void): Promise<any> | void => {
  store.commit("setConfirmPopup", toggle);
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
        store.dispatch("deleteUserProfile", userUID).then(() => {
          getAuth().currentUser?.delete()
          .then(() => {
            store.dispatch("userLogout");
          });
        })
      }
    });
  }
}