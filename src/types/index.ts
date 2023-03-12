import { ISelectElem } from "@/interfaces/index";

export type ErrorCode = { code: string } | string;

export type RefElement = HTMLInputElement | null;

export type DayTime = "Добрый день" | "Добрый вечер";

export type LangFormat = "ru-Ru" | "en-EN";

export type ApiMethod = "POST" | "GET" | "PUT" | "DELETE";

export type Status = "Admin" | "User";

export type ButtonSize = "sm" | "md" | "lg";

export type Variant = "info" | "danger" | "success";

export type SelectElements = Array<ISelectElem>;

export type MenuLocation = "top" | "bottom" | "start" | "end" | "center";
