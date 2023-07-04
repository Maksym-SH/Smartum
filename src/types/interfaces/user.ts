import type { EmailAuthCredential, User, UserCredential } from "firebase/auth";

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

export interface ICreateUser
  extends Omit<IUserInfo, "email" | "password" | "emailVerified" | "newPassword"> {
  uid: string;
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

export interface IUserFieldsUpdate extends Partial<IUserCreated> {}

export interface IUserResponse {
  accessToken?: string;
  displayName: string | null;
}
