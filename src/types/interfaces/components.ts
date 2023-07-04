import { ComputedRef } from "vue";
import { Colors } from "../enums";
import { IServerDate } from ".";
import { NotificationStatus, NotificationType, NotificationAction } from "../enums";
import { OmitAsideNavigation, ButtonVariant } from "../types";

export interface ISelectElem {
  title: string | ComputedRef<string>;
  callback: () => void;
  icon?: string;
  color?: Colors;
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
      color?: Colors;
    };
    yes: {
      variant?: ButtonVariant;
      text?: string;
      color?: Colors;
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
  status: NotificationStatus;
  date: T;
  image?: string;
  type: NotificationAction;
  uid?: string;
  textParams?: { title?: string };
  textType: NotificationType;
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
