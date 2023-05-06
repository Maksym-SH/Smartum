import { computed } from "vue";
import userStore from "@/store/User";
import { User } from "firebase/auth";
import { IUserCreated } from "@/interfaces";

const useUserUnicId = () => {
  const unicID = computed((): string => (userStore.state.currentUser as User).uid);
  const currentUser = computed((): User => userStore.state.currentUser as User);
  const userInfo = computed((): IUserCreated => userStore.state.userInfo)

  return {
    unicID,
    userInfo,
    currentUser
  }
}

export default useUserUnicId;