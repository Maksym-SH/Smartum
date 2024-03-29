import { getAuth } from "@firebase/auth";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import useStores from "@/composables/useStores";

import { Colors, Language } from "@/types/enums";
import type { IPopupParams } from "@/types/interfaces/components";
import type { Theme } from "@/types";

export function LocalLanguage(): Language {
  let language: Language;

  const savedLanguage = localStorage.getItem("smartumLanguage") ?? "";

  if (["ru", "eng"].includes(savedLanguage)) {
    language = savedLanguage as Language;
  } else {
    language = navigator.language === "ru-RU" ? Language.RU : Language.ENG;
  }

  return language;
}

export function ObjectFull(object: object): boolean {
  return Object.values(object).every((item) => item);
}

export function ObjectHasValues(object: object): boolean {
  return Object.values(object).some((value) => {
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some((nestedValue) => !!nestedValue);
    }

    return !!value;
  });
}

export function TheSameObject(firstObject: object, secondObject: object): boolean {
  return JSON.stringify(firstObject) === JSON.stringify(secondObject);
}

export function ObjectNotEmpty(object: object): boolean {
  return Object.keys(object).length > 0;
}

export function ArrayHasValues(array: any[]): boolean {
  return array.length > 0;
}

export function NewObjectLink<Type>(object: Type): Type {
  return JSON.parse(JSON.stringify(object));
}

export function OpenPopup(params: IPopupParams): void {
  const { commonStore } = useStores();
  commonStore.setPopupParams(params);
}

export function SetTheme(theme: Theme): void {
  document.body.setAttribute("data-theme", theme);
}

// Random light color generation.
export function GenerateColorHexFormat(Theme: Theme): string {
  const rangeColor = Theme === "dark" ? 0 : 128; // Dark or light generate color.

  // Generate random values for RGB components.
  const r = Math.floor(Math.random() * 128) + rangeColor;
  const g = Math.floor(Math.random() * 128) + rangeColor;
  const b = Math.floor(Math.random() * 128) + rangeColor;

  const colorHex = `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;

  return colorHex;

  // Helper function to convert component values to HEX.
  function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
}

export function GenerateJoinCode(length: number): string {
  const joinCode = GenerateRandomString(length);

  return joinCode;
}

export function GenerateRandomString(length: number): string {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * characters.length));

  return result;
}

let ConfirmCallback: Function;
export function Confirmation(toggle: boolean, callback?: Function | void): void {
  const { commonStore } = useStores();
  commonStore.setConfirmPopupVisibillity(toggle);

  if (callback && toggle) {
    ConfirmCallback = callback;
  } else {
    ConfirmCallback();
  }
}

export function DeleteAccountPopup(uid: string, params?: Partial<IPopupParams>): Function {
  const { t } = i18n.global;

  const { userStore } = useStores();
  const userUID: string = uid;
  const popupParams: Partial<IPopupParams> | null = params ?? null;

  return function () {
    OpenPopup({
      title: popupParams?.title || t("popup.deleteAccount.title"),
      text: popupParams?.text || t("popup.deleteAccount.text"),
      buttons: {
        yes: {
          text: t("buttons.deleteAccount"),
          color: Colors.DANGER,
        },
      },
      callback: (): void => {
        userStore.deleteUserProfile(userUID).then(() => {
          getAuth()
            .currentUser?.delete()
            .then(() => {
              userStore.userLogout();

              notify({
                title: t("notify.accountDeleted.title"),
                text: t("notify.accountDeleted.text"),
              });
            });
        });
      },
    });
  };
}

export function CreateDebounce(ms: number): Function {
  let CreateDebounceTimer: number;

  return function (callback: Function): void {
    clearTimeout(CreateDebounceTimer);
    CreateDebounceTimer = setTimeout(callback, ms);
  };
}
