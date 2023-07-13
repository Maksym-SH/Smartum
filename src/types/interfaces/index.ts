import type { ComputedRef } from "vue";

export interface IServerDate {
  seconds: number;
  nanoseconds: number;
}

export interface ILanguageTextInfo {
  title: "Русский" | "English";
  icon: "russian" | "english";
}

export interface ILanguage {
  eng: string;
  ru: string;
}

export interface FileResult {
  result: string;
  type: string;
}

export interface IDateFormat {
  time: string;
  date: string;
}

export interface ITabInfo {
  title: ComputedRef<string> | unknown;
  description: ComputedRef<string> | unknown;
}

// Router
export interface IMetaName {
  protected: boolean;
  tabName: string;
}
