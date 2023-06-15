export enum Language {
  Russian = "ru",
  English = "eng",
}

export enum Length {
  Text = 2,
  Password = 8,
  None = 0,
  Textarea = 255,
  Maximum = 45,
}

export enum LangFormat {
  Ru = "ru-Ru",
  Eng = "en-EN",
}

export enum FileFormat {
  App_JS = "application/javascript",
  App_XJS = "application/x-javascript",
  App_ES = "application/ecmascript",
  Text_JS = "text/javascript",
  Text_ES = "text/ecmascript",
  App_JSON = "application/json",
  App_ZIP = "application/zip",
  APP_GZIP = "application/gzip",
  APP_XPHP = "application/x-php",
  APP_XML = "application/xml",
  Text_XML = "text/xml",
  Text_XPython = "text/x-script.python",
}

export enum Numbers {
  ImageSize = 10000000,
  Second = 1000,
  MillisecondsInDay = 86400000,
  AppearElement = 400,
  EveningRU = 18,
  EveningENG = "6 AM",
  MorningRU = 6,
  MorningENG = "6 PM",
  JoinCodeSize = 15,
  AnimationTaskMove = 250,
}

export enum Layout {
  Mobile = 576,
  Tablet = 768,
  LargeTablet = 992,
  Laptop = 1024,
  Desktop = 1200,
}

export enum DataCollection {
  Dashboard = "dashboard",
  Profile = "profile",
  Notifications = "notifications",
  Configuration = "configuration",
  Users = "users",
}

export enum Links {
  GitHubAccount = "https://github.com/Maksym-SH",
  TelegramAccount = "https://t.me/yerspide",
}

export enum NotificationActionType {
  User,
  Dashboard,
  Profile,
  Verify,
  Reset,
  Configuration,
  Default,
  InviteToBoard,
}

export enum NotificationType {
  PasswordChange,
  WelcomeText,
  ConfigurationChange,
  EmailConfirm,
  DashboardCreate,
  InviteToBoard,
  SetAdmin,
}

export enum Colors {
  Default = "#1D242E",
  Success = "#2ed47a",
  Danger = "#f0483e",
  Info = "#21A8F4",
  Grey = "#283342",
  Black = "#000000",
  White = "#ffffff",
  LightGrey = "#E4E6EA",
  // Gradients
  GradientBlue = "#020024 linear-gradient(90deg, #020024 0%, #090979 25%, #00d4ff 100%)",
  GradientBluePink = "#00edff linear-gradient(90deg, #00edff 29%, #d700f7 100%)",
  GradientGreen = "#22c1c3 linear-gradient(0deg, #22c1c3 0%, #2aec96 29%, #2dfd84 100%)",
  GradientLightBlue = "#eeaeca radial-gradient(circle, #eeaeca 0%, #94bbe9 100%)",
  GradientGray = "#7a7d89 linear-gradient(90deg, #7a7d89 0%, #222e48 100%)",
  GradientRedBlue = "#ff2a00 linear-gradient(90deg, #ff2a00 20%, #0057ff 100%)",
}

export enum UserRole {
  Admin = "Администратор",
  Member = "Участник",
}
