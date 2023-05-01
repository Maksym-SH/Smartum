import { 
  OmitUserInfo, 
  AsideExpPanelNavigation, 
  ModalContentType, 
  NotificationStatus,
  NotificationCategory
} from "@/types/index";
import { User, EmailAuthCredential, UserCredential } from "firebase/auth";

// Components
export interface ISelectElem {
  title: string;
  callback: () => void;
  icon?: string;
  variant?: "info" | string;
  displaying: boolean
}
export interface IAsideNavigationItem {
  id: number;
  showed: boolean;
  alwaysDisplay?: boolean;
  title: string;
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
      variant?: string;
      text?: string;
    },
    yes: {
      variant?: string;
      text?: string;
    }
  },
  callback: () => any;
}
export interface IModalContent {
  ru: {
    title: string;
    text: string;
  },
  eng: {
    title: string;
    text: string;
  }
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

// User
export interface IUserLogin {
  email: string;
  password: string;
}
export interface IUserReg extends IUserLogin {
  firstName: string;
  lastName: string;
}
export interface IUserAuth {
  signUp: (userData: IUserReg, validate: boolean) => void;
  signIn: (userData: IUserLogin, validate: boolean) => void;
  reauthorization: (userInfo: User, credential: EmailAuthCredential) => Promise<UserCredential>;
}
export interface IPictureParams {
  url: string;
  bgAvatar?: string;
}
export interface IUpdatePictureBG extends Pick<IPictureParams, "bgAvatar"> {
  unicID: string;
}
export interface IUserInfo extends Omit<IUserReg, "password"> {
  firstName: string;
  lastName: string;
  phone: string;
  about: string;
  photoFile: File | null;
  avatarParams: IPictureParams;
  emailVerified?: boolean;
  newPassword: string;
}
export interface ICreateUser extends Omit<IUserInfo, OmitUserInfo> {
  uid: string;
}
export interface IAvatarUpdate {
  file: File | null;
  uid: string;
}
export interface INotificationItem<T> {
  id: number;
  title: string;
  status: NotificationStatus;
  date: T;
  image?: string;
  description: string;
  type: NotificationCategory;
}
export interface IUpdateNotifications {
  notifications: INotificationItem<INotificationDate>[];
  unicID: string;
}
export interface INotificationDate {
  seconds: number;
  nanoseconds: number;
}
export interface ICreateNotifyList {
  unicID: string;
  item: INotificationItem<Date>;
}
export interface  IConfiguration {
  navigations: string[];
  showEmailConfirm: boolean;
  asideBackgroundColor: string,
  showCurrentDate: boolean;
  showDeleteAccountButton: boolean;
}
export interface IConfigurationAdditional {
  showEmailConfirm: boolean;
  showCurrentDate: boolean; // Time and date in app header.
  showDeleteAccountButton: boolean;
}
export interface IAdditionalUpdate {
  additional: IConfigurationAdditional;
  unicID: string;
}
export interface INavigationListUpdate {
  navigations: IAsideNavigationItem[];
  unicID: string;
}

// Response
export interface IError {
  config?: object;
  status?: number;
  code?: number;
}
export interface IUserResponse {
  accessToken?: string,
  displayName: string | null;
}

// Store
export interface IUserState {
  currentUser: User;
  openConfirmPopup: boolean;
  userInfo: IUserCreated;
}
export interface IUserCreated {
  firstName: string;
  lastName?: string;
  about: string;
  phone: string;
  avatarParams: IPictureParams;
  photoFile?: File;
  uid?: string;
}
export interface IRootState {
  loadingStatus: boolean;
  popupParams: IPopupParams | {};
  openConfirmPopup: boolean;
  modalContentType: ModalContentType | "";
}
export interface INotificationState {
  newNotification: INotificationItem<INotificationDate> | {};
}
export interface IConfigState {
  asideNavigate: IAsideNavigationItem[];
  additionalParams: Omit<IConfiguration, "navigations">;
}

//Router
export interface IMetaName {
  protected: boolean;
  tabName: ILanguage;
}