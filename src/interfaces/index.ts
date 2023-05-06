import { Colors } from "@/enums";
import { 
  OmitUserInfo, 
  AsideExpPanelNavigation, 
  ModalContentType, 
  NotificationStatus,
  NotificationCategory,
  ButtonVariant
} from "@/types/index";
import { User, EmailAuthCredential, UserCredential } from "firebase/auth";
import { ComputedRef } from "vue";

export interface IServerDate {
  seconds: number;
  nanoseconds: number;
}

// Components
export interface ISelectElem {
  title: string;
  callback: () => void;
  icon?: string;
  color?: Colors;
  displaying: boolean | ComputedRef<boolean>
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
      variant?: ButtonVariant;
      text?: string;
      color?: Colors;
    },
    yes: {
      variant?: ButtonVariant;
      text?: string;
      color?: Colors;
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

// Dashboard 
export interface IBackgroundPhotos {
  forest: string;
  lake: string;
  lakeWithForest: string;
  mountains: string;
  river: string;
};
export interface IBackgroundGradient {
  backgroundBlue: Colors;
  backgroundBluePink: Colors,
  backgrondGreen: Colors;
  backgroundLightBlue: Colors;
  backgrondGray: Colors;
  backgroundRedBlue: Colors;
}

export interface IBackgroundDashboard {
  photos: IBackgroundPhotos;
  gradients: IBackgroundGradient;
};
export interface IWorkingBoardItem<Type = IServerDate> {
  title: string;
  background: string;
  tasks: any[];
  dateOfCreation: Type;
  joinCode: string;
  members: number;
}
export interface ICreateBoardParams {
  board: IWorkingBoardItem<Date>,
  unicID: string;
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
  notifications: INotificationItem<IServerDate>[];
  unicID: string;
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

// Notification state.
export interface INotificationState {
  newNotification: INotificationItem<IServerDate> | {};
}

// Configuration state.
export interface IConfigState {
  asideNavigate: IAsideNavigationItem[];
  additionalParams: Omit<IConfiguration, "navigations">;
}

// Dashboard state.
export interface IDashboardState {
  allDashboards: IWorkingBoardItem<Date | IServerDate>[]; 
}

// Router
export interface IMetaName {
  protected: boolean;
  tabName: ILanguage;
}