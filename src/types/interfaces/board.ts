import type { IUserForList } from "./user";
import type { IServerDate } from ".";

export interface ITaskComment {
  id: number;
  member: IUserForList;
  message: string;
  emoji: IEmoji[];
  dateOfCreate: Date | IServerDate;
  edited: boolean;
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

export interface IEmoji {
  smile: string;
  authors?: string[];
}

export interface INewEmojiParams {
  emoji: Required<IEmoji>;
  newAuthor: string;
}
