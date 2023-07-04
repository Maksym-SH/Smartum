import { IUserReg } from "./interfaces/user";
import * as components from "./interfaces/components";

// Components
export type Theme = "light" | "dark";

export type RefElement = HTMLInputElement | null;

export type TimeIcon = "moon" | "sun" | "";

export type StatusVueIcon = "email-check" | "email-alert";

export type ImageSource = string | ArrayBuffer | null;

export type LangFormatType = "ru-Ru" | "en-EN";

export type INotificationContent = Pick<components.INotification, "title" | "description">;

export type SwitchLanguageType = "button" | "select";

export type AutoComplete = "on" | "off" | "new-password";

export type ButtonSize = "x-small" | "small" | "large" | "x-large" | "default";

export type ExpansionPanelVariant = "accordion" | "default" | "inset" | "popout";

export type OmitAsideNavigation = Omit<
  components.IAsideNavItem,
  "icon" | "notify" | "panels" | "avatar"
>;

export type Variant = "info" | "danger" | "success";

export type ButtonVariant = "elevated" | "flat" | "tonal" | "outlined" | "text" | "plain";

export type PopupButtons = components.IPopupParams["buttons"];

export type SelectElements = components.ISelectElem[];

export type Position = "start" | "end";

export type FileType = "image" | "text";

export type ModelValue = string | number | unknown;

export type NotifyAction = "deleteNotification" | "readNotification";

export type UserName = Pick<IUserReg, "firstName" | "lastName">;

// Router
export type RouterMeta = Record<string | number | symbol, unknown>;

// Promise
export type ErrorCode = { code: string } | string;
