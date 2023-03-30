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