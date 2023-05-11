import { computed, reactive, ref, watchEffect } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import useNewNotificationContent from './useNotificationContent'
import useStores from './useStores'
import { Colors, NotificationType } from '@/types/enums'
import type { UserName } from '@/types/types'

import type {
  IAsideNavigationItem,
  IConfiguration,
  IConfigurationAdditional,
  IPictureParams,
  IUserInfo,
} from '@/types/interfaces'

import useAsideNavigation from '@/composables/useAsideNavigation'
import useCurrentUserInfo from '@/composables/useCurrentUserInfo'

function useConfiguration() {
  const { userStore, configurationStore, notificationStore } = useStores()

  const { unicID } = useCurrentUserInfo()

  const showedNavigations = reactive<IAsideNavigationItem[]>([
    ...useAsideNavigation(),
  ])

  const notificationAdded = ref(false)

  // Params
  const additionalParams = reactive<IConfigurationAdditional>({
    showEmailConfirm: true,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  })

  const avatarParams = reactive<Required<IPictureParams>>({
    bgAvatar: '',
    url: '',
  })

  const asideBackgroundColor = ref(Colors.Grey as string)

  const userName = computed((): UserName => {
    const { firstName, lastName } = userStore.userInfo as Required<IUserInfo>
    return {
      firstName,
      lastName,
    }
  })

  // Save card methods.
  const saveBackgroundAvatar = () => {
    userStore
      .updateUserBackgroundAvatar(avatarParams.bgAvatar, unicID.value)
      .then(() => {
        notify({
          title: 'Фон вашего фото профиля был успешно обнолен!',
        })
      })
  }

  const saveAdditional = () => {
    configurationStore
      .updateAdditionalParams(
        {
          ...additionalParams,
          asideBackgroundColor: asideBackgroundColor.value,
        },
        unicID.value,
      )
      .then(() => {
        notify({
          title: 'Настройки конфигурации были успешно сохранены!',
        })

        if (!notificationAdded.value) {
          const notification = useNewNotificationContent(
            NotificationType.ConfigurationChange,
          )

          notificationStore.setNewNotification(notification)
        }
        notificationAdded.value = true
      })
  }

  const saveNavigationList = () => {
    const navigations = showedNavigations.map(item => item.showed)

    configurationStore
      .updateNavigateItem(navigations, unicID.value)
      .then(() => {
        notify({
          title: 'Список отображаемых страниц был успешно сохранен!',
        })

        if (!notificationAdded.value) {
          const notification = useNewNotificationContent(
            NotificationType.ConfigurationChange,
          )

          notificationStore.setNewNotification(notification)
        }

        notificationAdded.value = true
      })
  }

  // Get info.
  watchEffect(() => {
    if (unicID.value) {
      configurationStore
        .getUserConfiguration(unicID.value)
        .then((configuration: Omit<IConfiguration, 'navigations'>) => {
          const navigationList: IAsideNavigationItem[]
            = configurationStore.asideNavigate
          showedNavigations.forEach(
            (item, index) => (item.showed = navigationList[index].showed),
          )

          // Set backgrond avatar.
          const currentBackgrondAvatar = userStore.userInfo.avatarParams
            .bgAvatar as Required<string>
          avatarParams.bgAvatar = currentBackgrondAvatar

          // Set additional params.
          asideBackgroundColor.value = configuration.asideBackgroundColor

          additionalParams.showDeleteAccountButton
            = configuration.showDeleteAccountButton
          additionalParams.showCurrentDate = configuration.showCurrentDate
          additionalParams.showEmailConfirm = configuration.showEmailConfirm
        })
    }
  })

  return {
    additionalParams,
    asideBackgroundColor,
    userName,
    avatarParams,
    showedNavigations,
    saveNavigationList,
    saveAdditional,
    saveBackgroundAvatar,
  }
}

export default useConfiguration
