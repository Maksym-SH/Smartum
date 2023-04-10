import { 
  ISelectElem,
  ILanguage, 
  IError,
  IUserCreated, 
  IRootState,
  IPopupParams,
  IAsideNavigationItemParams,
  IModalContent
} from "@/interfaces/index";
import { RouteRecordRaw } from "vue-router";
import { ActionContext } from "vuex";

// Components
export type RefElement = HTMLInputElement | null;

export type Welcome = "Добрый день" | "Добрый вечер";

export type EmailVerify = "Почта подтверждена" | "Почта не подтверждена"

export type Icon = "moon" | "sun";

export type StatusVueIcon = "mdi-email-check" | "mdi-email-alert";

export type ImageSource = string | ArrayBuffer | null;

export type IUserFieldsUpdate = Partial<IUserCreated>;

export type LangFormatType = "ru-Ru" | "en-EN";

export type ModalLanguageType = keyof IModalContent;

export type ModalContentLanguage = IModalContent[ModalLanguageType];

export type DynamicDescription = { [key: string]: ILanguage };

export type OmitUserInfo = "email" | "password" | "emailVerified" | "newPassword" | "photoURL";

// Props
export type AutoComplete = "on" | "off";

export type ButtonSize = "sm" | "md" | "lg";

export type ExpansionPanelVariant = "accordion" | "default" | "inset" | "popout";

export type AsideNavigationItems = Array<IAsideNavigationItemParams>;

export type OmitAsideNavigation = Omit<IAsideNavigationItemParams, "icon" | "notify" | "panels" | "avatar">;

export type AsideExpPanelNavigation = Required<OmitAsideNavigation>;

export type ModalContentType = "termsOfUse" | "copyright";

export type Variant = "info" | "danger" | "success";

export type PopupButtons = IPopupParams["buttons"];

export type SelectElements = Array<ISelectElem>;

export type Position = "top" | "bottom" | "start" | "end" | "center";

export type FileType = "image" | "text";

export type ModelValue = string | number | unknown;

// Store
export type RootContext = ActionContext<IRootState, IRootState>;

export type UserContext<State> = ActionContext<State, IRootState>;

// Router
export type Routes = Readonly<Array<RouteRecordRaw>>

export type RouterMeta = Record<string | number | symbol, unknown>;

// Promise
export type Error = Awaited<Promise<IError>>;

export type ErrorCode = { code: string } | string;