import type { EmailAuthCredential, User, UserCredential } from "firebase/auth";
import type { ComputedRef } from "vue";
import type { Colors, NotificationType } from "./enums";
import type {
  AsideExpPanelNavigation,
  ButtonVariant,
  NotificationCategory,
  NotificationStatus,
  OmitUserInfo,
} from "./types";

export interface IServerDate {
  seconds: number;
  nanoseconds: number;
}

export interface ILanguageTextInfo {
  title: "Русский" | "English";
  icon: "russian" | "english";
}

// Components
export interface ISelectElem {
  title: string | ComputedRef<string>;
  callback: () => void;
  icon?: string;
  color?: Colors;
  displaying: boolean | ComputedRef<boolean>;
  active?: boolean | ComputedRef<boolean>;
}
export interface IAsideNavigationItem {
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
export interface ILanguage {
  eng: string;
  ru: string;
}
export interface ITabInfo {
  title: ComputedRef<string> | unknown;
  description: ComputedRef<string> | unknown;
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
}
export interface IBackgroundGradient {
  backgroundBlue: Colors;
  backgroundBluePink: Colors;
  backgrondGreen: Colors;
  backgroundLightBlue: Colors;
  backgrondGray: Colors;
  backgroundRedBlue: Colors;
}

export interface IBackgroundDashboard {
  photos: IBackgroundPhotos;
  gradients: IBackgroundGradient;
}

export interface ITaskComment {
  id: number;
  member: IUserForList;
  message: string;
  emoji: IEmoji[];
  dateOfCreate: Date | IServerDate;
  edited: boolean;
}

export interface IEmoji {
  smile: string;
  authors?: string[];
}

export interface INewEmojiParams {
  emoji: Required<IEmoji>;
  newAuthor: string;
}

export interface IWorkingBoardTask {
  id: number;
  title: string;
  marks?: string[];
  subtasks?: ISubTask[];
  description?: string;
  subscribedToNotifications?: IWorkingBoardMember[];
  assignedMembers?: IUserForList[];
  comments: ITaskComment[];
  dateOfCreate: Date | IServerDate;
}

export interface ISubTask {
  id: number;
  title: string;
  done: boolean;
}

export interface IWorkingBoardTaskColumn {
  id: number;
  title: string;
  tasks: IWorkingBoardTask[];
}
export interface IWorkingBoardItem {
  title: string;
  background: string;
  columns: IWorkingBoardTaskColumn[];
  dateOfCreation: string;
  joinCode: string;
  members: IWorkingBoardMember[];
  uid: string;
}
export interface IWorkingBoardMember {
  uid: string;
  role?: unknown;
  invited?: boolean;
}

export interface IWorkingBoardResolve {
  value: IWorkingBoardItem;
  members: IUserForList[];
}
export interface ICreateBoardParams {
  board: IWorkingBoardItem;
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
  reauthorization: (
    userInfo: User,
    credential: EmailAuthCredential
  ) => Promise<UserCredential>;
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
  uid?: string;
}
export interface IUserForList
  extends Omit<IUserInfo, "photoFile" | "emailVerified" | "newPassword" | "email"> {
  uid: string;
  role?: unknown;
  invited?: boolean;
}
export interface ICreateUser extends Omit<IUserInfo, OmitUserInfo> {
  uid: string;
}

// Notification
export interface INotification<T = Date | IServerDate> {
  id: number;
  title: unknown;
  description: unknown;
  status: NotificationStatus;
  date: T;
  image?: string;
  type: NotificationCategory;
  uid?: string;
  textParams?: { title?: string };
  textType: NotificationType;
  joinCode?: string;
}
export interface INotificationContent extends Pick<INotification, "title" | "description"> {}

// Configuration
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
export interface IConfigurationAdditional {
  showEmailConfirm: boolean;
  showCurrentDate: boolean; // Time and date in app header.
  showDeleteAccountButton: boolean;
  asideBackgroundColor?: string;
}
// Color picker.
export interface IColorPickerParams {
  textColor: Colors;
  target: string;
}

// Response
export interface IUserResponse {
  accessToken?: string;
  displayName: string | null;
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

// Router
export interface IMetaName {
  protected: boolean;
  tabName: string;
}

// Colors

export interface ILightColors {
  pastelPink: string;
  pastelYellow: string;
  pastelCyan: string;
  pastelBlue: string;
  pastelGreen: string;
  pastelOrange: string;
  salmon: string;
  salmonCriola: string;
  yellowPink: string;
  yellowCrayola: string;
  lime: string;
  bluefrost: string;
  pearl: string;
  creamy: string;
  snowBlue: string;
  apple: string;
  banano: string;
  paleGold: string;
  gold: string;
  sky: string;
}
export interface IDarkColors {
  moray: string;
  pearlOpal: string;
  black: string;
  signalBlue: string;
  deepPurple: string;
  grayBlue: string;
  falunRed: string;
  willowBrown: string;
  deepGreen: string;
  three: string;
  turquoise: string;
  azureBlue: string;
  sandyTaupe: string;
  brown: string;
  copper: string;
  darkGrey: string;
  purple: string;
  redPurple: string;
  darkAzure: string;
  spruce: string;
}
