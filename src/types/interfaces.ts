import type { EmailAuthCredential, User, UserCredential } from 'firebase/auth'
import type { ComputedRef } from 'vue'
import type { Colors } from './enums'
import type {
  AsideExpPanelNavigation,
  ButtonVariant,
  ColorThemeText,
  NotificationCategory,
  NotificationStatus,
  OmitUserInfo,
} from './types'

export interface IServerDate {
  seconds: number
  nanoseconds: number
}

// Components
export interface ISelectElem {
  title: string
  callback: () => void
  icon?: string
  color?: Colors
  displaying: boolean | ComputedRef<boolean>
}
export interface IAsideNavigationItem {
  id: number
  showed: boolean
  alwaysDisplay?: boolean
  title: string
  icon?: string
  notify?: true
  callback?: () => void
  panels?: Omit<AsideExpPanelNavigation, 'id' | 'showed' | 'alwaysDisplay'>[]
}
export interface IPopupParams {
  title?: string
  text?: string
  buttons: {
    no?: {
      variant?: ButtonVariant
      text?: string
      color?: Colors
    }
    yes: {
      variant?: ButtonVariant
      text?: string
      color?: Colors
    }
  }
  callback: () => any
}
export interface IModalContent {
  ru: {
    title: string
    text: string
  }
  eng: {
    title: string
    text: string
  }
}
export interface ILanguage {
  eng: string
  ru: string
}
export interface FileResult {
  result: string
  type: string
}
export interface IDateFormat {
  time: string
  date: string
}

// Dashboard
export interface IBackgroundPhotos {
  forest: string
  lake: string
  lakeWithForest: string
  mountains: string
  river: string
}
export interface IBackgroundGradient {
  backgroundBlue: Colors
  backgroundBluePink: Colors
  backgrondGreen: Colors
  backgroundLightBlue: Colors
  backgrondGray: Colors
  backgroundRedBlue: Colors
}

export interface IBackgroundDashboard {
  photos: IBackgroundPhotos
  gradients: IBackgroundGradient
}
export interface IWorkingBoardItem {
  title: string
  background: string
  tasks: any[]
  dateOfCreation: IServerDate | Date
  joinCode: string
  members: number
}
export interface ICreateBoardParams {
  board: IWorkingBoardItem
  unicID: string
}

// User
export interface IUserLogin {
  email: string
  password: string
}
export interface IUserReg extends IUserLogin {
  firstName: string
  lastName: string
}
export interface IUserAuth {
  signUp: (userData: IUserReg, validate: boolean) => void
  signIn: (userData: IUserLogin, validate: boolean) => void
  reauthorization: (
    userInfo: User,
    credential: EmailAuthCredential
  ) => Promise<UserCredential>
}
export interface IPictureParams {
  url: string
  bgAvatar?: string
}
export interface IUpdatePictureBG extends Pick<IPictureParams, 'bgAvatar'> {
  unicID: string
}
export interface IUserInfo extends Omit<IUserReg, 'password'> {
  firstName: string
  lastName: string
  phone: string
  about: string
  photoFile: File | null
  avatarParams: IPictureParams
  emailVerified?: boolean
  newPassword: string
  uid?: string
}
export interface ICreateUser extends Omit<IUserInfo, OmitUserInfo> {
  uid: string
}
export interface INotification<T> {
  id: number
  title: string
  status: NotificationStatus
  date: T
  image?: string
  description: string
  type: NotificationCategory
}
export interface IConfiguration {
  navigations: string[]
  showEmailConfirm: boolean
  asideBackgroundColor: string
  showCurrentDate: boolean
  showDeleteAccountButton: boolean
}
export interface IConfigurationResponse
  extends Omit<IConfiguration, 'navigations'> {
  navigationsShowValues: boolean[]
}
export interface IConfigurationAdditional {
  showEmailConfirm: boolean
  showCurrentDate: boolean // Time and date in app header.
  showDeleteAccountButton: boolean
  asideBackgroundColor?: string
}
// Color picker.
export interface IColorPickerParams {
  textColor: Colors
  target: ColorThemeText
}

// Response
export interface IError {
  config?: object
  status?: number
  code?: number
}
export interface IUserResponse {
  accessToken?: string
  displayName: string | null
}
export interface IUserCreated {
  firstName: string
  lastName?: string
  about: string
  phone: string
  avatarParams: IPictureParams
  photoFile?: File
  uid?: string
}

// Router
export interface IMetaName {
  protected: boolean
  tabName: ILanguage
}