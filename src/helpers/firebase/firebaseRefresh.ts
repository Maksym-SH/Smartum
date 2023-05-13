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
        .then(async () => {
          userStore.setCurrentUser(user)

          await userStore.getUserProfile(user.uid).then(() => {
            configurationStore.getUserConfiguration(user.uid)
          })
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
        .finally(() => commonStore.showTemplateApplication = true)
    }
    else {
      userStore.userLogout()
      commonStore.showTemplateApplication = true
    }
  })
}
