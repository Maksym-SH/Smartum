import { NotificationActionType } from "@/enums";
import { 
  ISelectElem,
  ILanguage, 
  IError,
  IUserCreated, 
  IPopupParams,
  IAsideNavigationItem,
  IModalContent,
  IUserReg,
} from "@/interfaces/index";

import { RouteRecordRaw } from "vue-router";

// Components

export type Theme = "light" | "dark";

export type RefElement = HTMLInputElement | null;

export type WelcomeText = "Добрый день" | "Добрый вечер";

export type EmailVerify = "Адрес подтверждён" | "Адрес не подтверждён";

export type ColorThemeText = "Тёмный" | "Светлый";

export type Icon = "moon" | "sun";

export type StatusVueIcon = "mdi-email-check" | "mdi-email-alert";

export type ImageSource = string | ArrayBuffer | null;

export type IUserFieldsUpdate = Partial<IUserCreated>;

export type LangFormatType = "ru-Ru" | "en-EN";

export type ModalLanguageType = keyof IModalContent;

export type ModalContentLanguage = IModalContent[ModalLanguageType];

export type DynamicDescription = { [key: string]: ILanguage };

export type OmitUserInfo = "email" | "password" | "emailVerified" | "newPassword";

// Props

export type AutoComplete = "on" | "off" | "new-password";

export type ButtonSize = "x-small" | "small" | "large" | "x-large" | "default";

export type ExpansionPanelVariant = "accordion" | "default" | "inset" | "popout";

export type AsideNavigationItems = IAsideNavigationItem[];

export type OmitAsideNavigation = Omit<IAsideNavigationItem, "icon" | "notify" | "panels" | "avatar">;

export type AsideExpPanelNavigation = Required<OmitAsideNavigation>;

export type ModalContentType = "termsOfUse" | "confidentiality" | "";

export type Variant = "info" | "danger" | "success";

export type ButtonVariant = "elevated" | "flat" | "tonal" | "outlined" | "text" | "plain";

export type PopupButtons = IPopupParams["buttons"];

export type SelectElements = ISelectElem[];

export type Position = "top" | "bottom" | "start" | "end" | "center";

export type NotificationStatus = "read" | "not read";

export type FileType = "image" | "text";

export type ModelValue = string | number | unknown;

export type NotificationCategory = NotificationActionType;

export type NotifyAction = "deleteNotification" | "readNotification";

export type UserName = Pick<IUserReg, "firstName" | "lastName">;

export type EmptyListType = "notification" | "dashboard";

// Router

export type Routes = Readonly<RouteRecordRaw[]>;

export type RouterMeta = Record<string | number | symbol, unknown>;

// Promise

export type Error = Awaited<Promise<IError>>;

export type ErrorCode = { code: string } | string;