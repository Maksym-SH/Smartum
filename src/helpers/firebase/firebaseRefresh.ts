import { getAuth } from 'firebase/auth'
import ShowErrorMessage from './firebaseErrorMessage'
import type { ErrorCode } from '@/types/types'

import useStores from '@/composables/useStores'

export default async function refreshUserInfo(): Promise<void> {
  const { commonStore, userStore, configurationStore } = useStores()

  commonStore.setLoadingStatus(true)

  await getAuth().onAuthStateChanged((user) => {
    if (user) {
      getAuth()
        .currentUser?.getIdToken(true)
        .then(() => {
          userStore.setCurrentUser(user)

          userStore.getUserProfile(user.uid).then(() => {
            configurationStore.getUserConfiguration(user.uid)
          })
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
    }
    else {
      userStore.userLogout()
    }
  })
}
