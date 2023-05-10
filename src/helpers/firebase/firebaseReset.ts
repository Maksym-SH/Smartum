import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { notify } from '@kyvg/vue3-notification'
import ShowErrorMessage from './firebaseErrorMessage'
import type { ErrorCode } from '@/types/types'

import useStores from '@/composables/useStores'
import router from '@/router'

function firebaseReset(email: string): void {
  const { commonStore } = useStores()

  if (!email)
    return

  commonStore.setLoadingStatus(true)

  sendPasswordResetEmail(getAuth(), email)
    .then(() => {
      notify({
        title: 'Успешно!',
        text: 'Сообщение восстановления пароля отправлено вам на почту!',
        type: 'success',
      })
      if (window.history.length >= 2) {
        router.go(-1) // Navigate to previous page.
      }
      else {
        getAuth().currentUser
          ? router.push({ name: 'Profile' })
          : router.push({ name: 'SignIn' })
      }
    })
    .catch((error: ErrorCode) => ShowErrorMessage(error))
    .finally(() => commonStore.setLoadingStatus(false))
}

export default firebaseReset
