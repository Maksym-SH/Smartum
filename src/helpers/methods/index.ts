import { IPopupParams } from "@/interfaces";
import store from "@/store";

export const ObjectFull = (object: object): boolean => {
  return Object.values(object).every((item) => item);
}

export const ObjectNotEmpty = (object: object): boolean => {
  return Object.keys(object).length > 0;
}

export const OpenPopup = (params: IPopupParams): void => { 
  store.dispatch("setPopupParams", params);
}

let ConfirmCallback: Function;
export const Confirmation = (toggle: boolean, callback?: Function): Promise<any> | void => {
  store.dispatch("setConfirmPopup", toggle);
  if (callback && toggle) {
    ConfirmCallback = callback;
  } 
  else return new Promise((resolve) => {
    resolve(ConfirmCallback());
  })
}