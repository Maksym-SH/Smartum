export enum Language {
  Russian = "ru",
  English = "eng"
}

export enum Length {
  Text = 3,
  Password = 8,
  None = 0,
  Textarea = 255,
  Maximum = 45
}

export enum LangFormat {
  Ru = "ru-Ru",
  Eng = "en-EN"
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
  Text_XPython = "text/x-script.python"
}

export enum Numbers {
  ImageSize = 10000000,
  Second = 1000,
  MillisecondsInDay = 86400000,
  AppearElement = 400,
  EveningRU = 16,
  EveningENG = "4 AM",
  MorningRU = 4,
  MorningENG = "4 PM"
}

export enum Layout {
  Mobile = 576,
  Tablet = 768,
  LargeTablet = 992,
  Laptop = 1024,
  Desktop = 1200
}

export enum DataCollection {
  Profile = "profile",
  Notifications="notifications",
  Configuration="configuration"
}

export enum Links {
  GitHubAccount = "https://github.com/Maksym-SH",
  TelegramAccount = "https://t.me/yerspide"
}

export enum NotificationActionType {
  User,
  Dashboard,
  Profile,
  Verify,
  Reset,
  Configuration,
  Default
}

export enum NotificationType {
  PasswordChange,
  WelcomeText,
  ConfigurationChange,
  EmailConfirm
}

export enum Colors {
  Grey="#283342",
  MaxColorHEXValue=256,
  MaxHexDigits=2
}