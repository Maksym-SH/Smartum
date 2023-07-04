export enum Route {
  SIGN_IN = "SignIn",
  SIGN_UP = "SignUp",
  FORGOT = "Forgot",
  HOME = "Home",
  PROFILE = "Profile",
  NOTIFICATIONS = "Notifications",
  REPORTS = "Reports",
  CONFIGURATION = "Configuration",
  DASHBOARD = "Dashboard",
  BOARD = "Board",
  NOT_FOUND = "NotFound",
}

export enum EmptyListType {
  DASHBOARD,
  NOTIFICATIONS,
}

export enum ModalContentType {
  TERMS_OF_USE = "termsOfUse",
  CONFIDENTIALITY = "confidentiality",
  NONE = "",
}

export enum NotificationStatus {
  READ = "read",
  NOT_READ = "not read",
}

export enum Language {
  RU = "ru",
  ENG = "eng",
}

export enum Length {
  TEXT = 2,
  PASSWORD = 8,
  NONE = 0,
  TEXTAREA = 255,
  MAX = 45,
}

export enum LangFormat {
  RU = "ru-Ru",
  ENG = "en-EN",
}

export enum Numbers {
  IMAGE_SIZE = 10000000,
  SECOND = 1000,
  DAY_MILLISECONDS = 86400000,
  APPEAR_ELEMENT = 400,
  EVENING_TIME = 18,
  MORNING_TIME = 6,
  JOIN_CODE_SIZE = 15,
  ANIMATION_TASK_MOVE = 250,
}

export enum Layout {
  MOBILE = 576,
  TABLET = 768,
  LARGE_TABLET = 992,
  LAPTOP = 1024,
  DESKTOP = 1200,
}

export enum DataCollection {
  DASHBOARD = "dashboard",
  PROFILE = "profile",
  NOTIFICATIONS = "notifications",
  CONFIGURATION = "configuration",
  USERS = "users",
}

export enum Links {
  GIT_HUB_ACCOUNT = "https://github.com/Maksym-SH",
  TELEGRAM_ACCOUNT = "https://t.me/yerspide",
}

export enum NotificationAction {
  USER,
  DASHBOARD,
  PROFILE,
  VERIFY,
  RESET,
  CONFIGURATION,
  DEFAULT,
  INVITE_TO_BOARD,
}

export enum NotificationType {
  PASSWORD_CHANGE,
  WELCOME_TEXT,
  CONFIGURATION_CHANGE,
  EMAIL_CONFIRM,
  BOARD_CREATED,
  INVITE_TO_BOARD,
  SET_ADMIN,
}

export enum Colors {
  DEFAULT = "#1D242E",
  SUCCESS = "#2ed47a",
  DANGER = "#f0483e",
  INFO = "#21A8F4",
  GREY = "#283342",
  BLACK = "#000000",
  WHITE = "#ffffff",
  LIGHT_GREY = "#E4E6EA",
  // Gradients
  GRADIENT_BLUE = "#020024 linear-gradient(90deg, #020024 0%, #090979 25%, #00d4ff 100%)",
  GRADIENT_BLUE_PINK = "#00edff linear-gradient(90deg, #00edff 29%, #d700f7 100%)",
  GRADIENT_GREEN = "#22c1c3 linear-gradient(0deg, #22c1c3 0%, #2aec96 29%, #2dfd84 100%)",
  GRADIENT_LIGHT_BLUE = "#eeaeca radial-gradient(circle, #eeaeca 0%, #94bbe9 100%)",
  GRADIENT_GRAY = "#7a7d89 linear-gradient(90deg, #7a7d89 0%, #222e48 100%)",
  GRADIENT_RED_BLUE = "#ff2a00 linear-gradient(90deg, #ff2a00 20%, #0057ff 100%)",
}

export enum UserRole {
  ADMIN = "Admin",
  MEMBER = "Member",
}
