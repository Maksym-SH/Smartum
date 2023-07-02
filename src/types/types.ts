import type { RouteRecordRaw } from "vue-router";
import type { NotificationActionType } from "./enums";
import type {
  IAsideNavigationItem,
  IModalContent,
  INotification,
  IPopupParams,
  ISelectElem,
  IUserCreated,
  IUserReg,
} from "./interfaces";

// Components
export type Theme = "light" | "dark";

export type RefElement = HTMLInputElement | null;

export type Icon = "moon" | "sun";

export type StatusVueIcon = "email-check" | "email-alert";

export type ImageSource = string | ArrayBuffer | null;

export type IUserFieldsUpdate = Partial<IUserCreated>;

export type LangFormatType = "ru-Ru" | "en-EN";

export type ModalLanguageType = keyof IModalContent;

export type ModalContentLanguage = IModalContent[ModalLanguageType];

export type INotificationList = INotification[];

export type OmitUserInfo = "email" | "password" | "emailVerified" | "newPassword";

// I18n
export type I18nLanguage = "ru" | "eng";

// Props

export type SwitchLanguageType = "button" | "select";

export type AutoComplete = "on" | "off" | "new-password";

export type ButtonSize = "x-small" | "small" | "large" | "x-large" | "default";

export type ExpansionPanelVariant = "accordion" | "default" | "inset" | "popout";

export type AsideNavigationItems = IAsideNavigationItem[];

export type OmitAsideNavigation = Omit<
  IAsideNavigationItem,
  "icon" | "notify" | "panels" | "avatar"
>;

export type AsideExpPanelNavigation = Required<OmitAsideNavigation>;

export type ModalContentType = "termsOfUse" | "confidentiality" | "";

export type Variant = "info" | "danger" | "success";

export type ButtonVariant = "elevated" | "flat" | "tonal" | "outlined" | "text" | "plain";

export type PopupButtons = IPopupParams["buttons"];

export type SelectElements = ISelectElem[];

export type Position = "start" | "end";

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
export type ErrorCode = { code: string } | string;
