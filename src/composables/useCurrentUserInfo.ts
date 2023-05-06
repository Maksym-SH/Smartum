import { computed } from "vue";
import { User } from "firebase/auth";
import { IUserCreated } from "@/interfaces";
import useStores from "./useStores";

const useUserUnicId = () => {
  const { userStore } = useStores();

  const unicID = computed((): string => (userStore.currentUser as User).uid);
  const currentUser = computed((): User => userStore.currentUser as User);
  const userInfo = computed((): IUserCreated => userStore.userInfo)

  return {
    unicID,
    userInfo,
    currentUser
  }
}

export default useUserUnicId;