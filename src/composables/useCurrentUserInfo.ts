import { computed } from "vue";

import type { User } from "firebase/auth";
import useStores from "./useStores";

import type { IUserCreated, IUserForList, IUserInfo } from "@/types/interfaces/user";

export default function useCurrentUserInfo() {
  const { userStore } = useStores();

  const unicID = computed((): string => (userStore.currentUser as User).uid);
  const currentUser = computed((): User => userStore.currentUser as User);
  const userInfo = computed((): IUserCreated => userStore.userInfo);

  const getFullName = (user: IUserForList | IUserInfo): string => {
    return `${user.firstName} ${user.lastName ? user.lastName : ""}`;
  };

  return {
    unicID,
    userInfo,
    currentUser,
    getFullName,
  };
}
