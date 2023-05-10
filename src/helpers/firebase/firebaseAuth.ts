import type {
  EmailAuthCredential,
  User,
  UserCredential,
} from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  getAuth,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import { notify } from '@kyvg/vue3-notification'
import ShowErrorMessage from './firebaseErrorMessage'
import type {
  INotification,
  IUserAuth,
  IUserLogin,
  IUserReg,
  IUserResponse,
} from '@/types/interfaces'

import type { ErrorCode } from '@/types/types'
import { GenerateColorHexFormat } from '@/helpers/methods'
import { NotificationType } from '@/types/enums'

import router from '@/router'
import notificationContent from '@/composables/useNotificationContent'
import useStores from '@/composables/useStores'

function firebaseAuth(): IUserAuth {
  const { commonStore, userStore, notificationStore, configurationStore }
    = useStores()

  const useAuth = {
    signUp: (userData: IUserReg, validate: boolean): void => {
      if (!validate)
        return

      commonStore.setLoadingStatus(true)

      createUserWithEmailAndPassword(
        getAuth(),
        userData.email,
        userData.password,
      )
        .then(async (response) => {
          const responseUser: IUserResponse = response.user
          const currentUser = getAuth().currentUser

          if (responseUser.accessToken)
            localStorage.setItem('smartumToken', responseUser.accessToken)

          if (currentUser) {
            userStore.createUserProfile({
              uid: currentUser.uid,
              firstName: userData.firstName,
              lastName: userData.lastName,
              avatarParams: {
                url: '',
                bgAvatar: GenerateColorHexFormat('light'),
              },
            })

            const notification: INotification<Date> = notificationContent(
              NotificationType.WelcomeText,
            )

            notificationStore.createNotificationList(
              notification,
              currentUser.uid,
            )

            // Create user configuration field in database.
            configurationStore.createUserConfiguration(currentUser.uid)
          }

          notify({
            title: 'Вы успешно вошли в аккаунт.',
            type: 'success',
          })

          userStore.setCurrentUser(getAuth().currentUser as User)
          router.push({ name: 'Notifications' })
        })
        .catch((error: ErrorCode): void => ShowErrorMessage(error))
        .finally((): void => commonStore.setLoadingStatus(false))
    },

    signIn: (userData: IUserLogin, validate: boolean): void => {
      if (!validate)
        return

      commonStore.setLoadingStatus(true)
      signInWithEmailAndPassword(getAuth(), userData.email, userData.password)
        .then((response) => {
          const user: IUserResponse = response.user

          if (user.accessToken)
            localStorage.setItem('smartumToken', user.accessToken)

          userStore.setCurrentUser(getAuth().currentUser as User)
          notify({
            title: 'Вы успешно вошли в аккаунт.',
            type: 'success',
          })
          router.push({ name: 'Home' })
        })
        .catch((error): void => ShowErrorMessage(error))
        .finally((): void => commonStore.setLoadingStatus(false))
    },
    reauthorization: (
      userInfo: User,
      credential: EmailAuthCredential,
    ): Promise<UserCredential> => {
      commonStore.setLoadingStatus(true)

      return new Promise((resolve, reject) => {
        reauthenticateWithCredential(userInfo, credential)
          .then((response: UserCredential) => resolve(response))
          .catch((error: ErrorCode): void => {
            ShowErrorMessage(error)
            reject(error)
          })
          .finally(() => commonStore.setLoadingStatus(false))
      })
    },
  }

  return useAuth
}

export default firebaseAuth
