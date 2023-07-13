import type { ComputedRef } from "vue";
import type * as enums from "../enums";
import type { ButtonVariant, OmitAsideNavigation } from "../types";
import type { IServerDate } from ".";

export interface ISelectElem {
  title: string | ComputedRef<string>;
  callback: () => void;
  icon?: string;
  color?: enums.Colors;
  displaying: boolean | ComputedRef<boolean>;
  active?: boolean | ComputedRef<boolean>;
}

export type AsideExpPanelNavigation = Required<OmitAsideNavigation>;

export interface IAsideNavItem {
  id: number;
  showed: boolean;
  alwaysDisplay?: boolean;
  title: unknown;
  icon?: string;
  notify?: true;
  callback?: () => void;
  panels?: Omit<AsideExpPanelNavigation, "id" | "showed" | "alwaysDisplay">[];
}

export interface IPopupParams {
  title?: string;
  text?: string;
  buttons: {
    no?: {
      variant?: ButtonVariant;
      text?: string;
      color?: enums.Colors;
    };
    yes: {
      variant?: ButtonVariant;
      text?: string;
      color?: enums.Colors;
    };
  };
  callback: () => any;
}

export interface IModalContent {
  title: string;
  content: string;
}

export interface INotification<T = Date | IServerDate> {
  id: number;
  title: unknown;
  description: unknown;
  status: enums.NotificationStatus;
  date: T;
  image?: string;
  type: enums.NotificationAction;
  uid?: string;
  textParams?: { title?: string };
  textType: enums.NotificationType;
  joinCode?: string;
}

export interface IConfiguration {
  navigations: string[];
  showEmailConfirm: boolean;
  asideBackgroundColor: string;
  showCurrentDate: boolean;
  showDeleteAccountButton: boolean;
}
export interface IConfigurationResponse extends Omit<IConfiguration, "navigations"> {
  navigationsShowValues: boolean[];
}
export interface IConfigAdditional {
  showEmailConfirm: boolean;
  showCurrentDate: boolean; // Time and date in app header.
  showDeleteAccountButton: boolean;
  asideBackgroundColor?: string;
}
