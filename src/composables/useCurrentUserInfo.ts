import { computed } from 'vue'
import type { User } from 'firebase/auth'
import useStores from './useStores'
import type { IUserCreated } from '@/types/interfaces'

function useUserUnicId() {
  const { userStore } = useStores()

  const unicID = computed((): string => (userStore.currentUser as User).uid)
  const currentUser = computed((): User => userStore.currentUser as User)
  const userInfo = computed((): IUserCreated => userStore.userInfo)

  return {
    unicID,
    userInfo,
    currentUser,
  }
}

export default useUserUnicId
