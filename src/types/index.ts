import { ISelectElem, ILanguage, IError } from "@/interfaces/index";

export type Error = Awaited<Promise<IError>>;

export type ErrorCode = { code: string } | string;

export type RefElement = HTMLInputElement | null;

export type WelcomeType = "Добрый день" | "Добрый вечер";

export type EmailVerify = "Почта подтверждена" | "Почта не подтверждена"

export type Icon = "moon" | "sun";

export type IImageSource = string | ArrayBuffer | null;

export type IUserFieldsUpdate = Partial<{ about: string, phone: string, photoURL: string }>;

export type LangFormat = "ru-Ru" | "en-EN";

export type AutoComplete = "on" | "off";

export type ApiMethod = "POST" | "GET" | "PUT" | "DELETE";

export type Status = "Admin" | "User";

export type ButtonSize = "sm" | "md" | "lg";

export type Variant = "info" | "danger" | "success";

export type SelectElements = Array<ISelectElem>;

export type Position = "top" | "bottom" | "start" | "end" | "center";

export type DynamicDescription = { [key: string]: ILanguage };

export type FileType = "image" | "text";

export type RouterMeta = Record<string | number | symbol, unknown>;

export type ModelValue = string | number | unknown;
