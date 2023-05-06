import { IPopupParams } from "@/interfaces";
import { getAuth } from "@firebase/auth";
import { Theme } from "@/types";

import store from "@/store";
import { notify } from "@kyvg/vue3-notification";
import { Colors } from "@/enums";

export const ObjectFull = (object: object): boolean => {
  return Object.values(object).every((item) => item);
}

export const ObjectHasValues = (object: Object): boolean => {
  return Object.values(object).some((value) => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((nestedValue) => !!nestedValue);
    }
    return !!value;
  });
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

export const GenerateRandomString = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
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
          color: Colors.Danger
        },
      },
      callback: (): void => {
        store.dispatch("deleteUserProfile", userUID).then(() => {
          getAuth().currentUser?.delete()
          .then(() => {
            store.dispatch("userLogout");
            
            notify({
              title: "Ваш аккаунт был успешно удален!",
              text: "Вы можете авторизоваться другим аккаунтом либо создать новый."
            })
          });
        })
      }
    });
  }
}