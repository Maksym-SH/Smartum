import { 
  ISelectElem,
  ILanguage, 
  IError, 
  IExpPanelItem, 
  IUserCreated, 
  IRootState,
  IPopupParams
} from "@/interfaces/index";
import { ActionContext } from "vuex";

export type Error = Awaited<Promise<IError>>;

export type AwaitType<T> = Awaited<T>;

export type ErrorCode = { code: string } | string;

export type RefElement = HTMLInputElement | null;

export type WelcomeType = "Добрый день" | "Добрый вечер";

export type EmailVerify = "Почта подтверждена" | "Почта не подтверждена"

export type Icon = "moon" | "sun";

export type StatusVueIcon = "mdi-email-check" | "mdi-email-alert";

export type IImageSource = string | ArrayBuffer | null;

export type IUserFieldsUpdate = Partial<IUserCreated>;

export type LangFormatType = "ru-Ru" | "en-EN";

export type AutoComplete = "on" | "off";

export type Status = "Admin" | "User";

export type ButtonSize = "sm" | "md" | "lg";

export type ExpansionPanelVariant = "accordion" | "default" | "inset" | "popout";

export type ExpansionPanelItems = Array<IExpPanelItem>;

export type Variant = "info" | "danger" | "success";

export type PopupButtons = IPopupParams["buttons"];

export type SelectElements = Array<ISelectElem>;

export type Position = "top" | "bottom" | "start" | "end" | "center";

export type DynamicDescription = { [key: string]: ILanguage };

export type FileType = "image" | "text";

export type RouterMeta = Record<string | number | symbol, unknown>;

export type ModelValue = string | number | unknown;

// Omit
export type OmitUserInfo = "email" | "password" | "emailVerified" | "newPassword" | "photoURL";
// Store
export type RootContext = ActionContext<IRootState, IRootState>;

export type UserContext<State> = ActionContext<State, IRootState>;