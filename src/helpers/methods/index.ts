import { getAuth } from "@firebase/auth";
import { notify } from "@kyvg/vue3-notification";
import { Colors } from "@/types/enums";
import type { IPopupParams } from "@/types/interfaces";
import type { Theme } from "@/types/types";

import useStores from "@/composables/useStores";

export function ObjectFull(object: object): boolean {
  return Object.values(object).every((item) => item);
}

export function ObjectHasValues(object: Object): boolean {
  return Object.values(object).some((value) => {
    if (typeof value === "object" && value !== null)
      return Object.values(value).some((nestedValue) => !!nestedValue);

    return !!value;
  });
}

export function TheSameObject(firstObject: Object, secondObject: Object): boolean {
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
  function componentToHex(c: number) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
}

export function GenerateJoinCode(length: number) {
  const joinCode = GenerateRandomString(length);

  return joinCode;
}

export function GenerateRandomString(length: number) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
}

let ConfirmCallback: Function;
export function Confirmation(
  toggle: boolean,
  callback?: Function | void
): Promise<any> | void {
  const { commonStore } = useStores();
  commonStore.setConfirmPopupVisibillity(toggle);

  if (callback && toggle) {
    ConfirmCallback = callback;
  } else {
    return new Promise((resolve) => {
      resolve(ConfirmCallback());
    });
  }
}

export function DeleteAccountPopup(
  uid: string,
  params?: Partial<IPopupParams>
): Function {
  const { userStore } = useStores();
  const userUID: string = uid;
  const popupParams: Partial<IPopupParams> | null = params ?? null;

  return function () {
    OpenPopup({
      title: popupParams?.title || "Удалить аккаунт?",
      text: popupParams?.text || "Это действие необратимо!",
      buttons: {
        yes: {
          text: "Удалить аккаунт",
          color: Colors.Danger,
        },
      },
      callback: (): void => {
        userStore.deleteUserProfile(userUID).then(() => {
          getAuth()
            .currentUser?.delete()
            .then(() => {
              userStore.userLogout();

              notify({
                title: "Ваш аккаунт был успешно удален!",
                text: "Вы можете авторизоваться другим аккаунтом либо создать новый.",
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
