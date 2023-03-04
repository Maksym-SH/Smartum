export interface User {
  email: string,
  password: string,
  repeatPassword?: string,
}
export type ErrorCode = { code: string } | string;