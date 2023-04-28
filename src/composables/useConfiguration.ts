import { watchEffect, reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import { notify } from '@kyvg/vue3-notification';
import { Colors, NotificationType } from '@/enums';
import { UserName } from "@/types";
import { 
  IAsideNavigationItem, 
  IConfiguration, 
  IConfigurationAdditional, 
  IPictureParams 
} from '@/interfaces';

import useAsideNavigation from "@/composables/useAsideNavigation";
import useNewNotificationContent from "./useNotificationContent";

const useConfiguration = () => {
  const store = useStore();

  const showedNavigations = reactive<IAsideNavigationItem[]>([
    ...useAsideNavigation()
  ]);

  const notificationAdded = ref(false);

  // Params
  const additionalParams = reactive<IConfigurationAdditional>({
    showEmailConfirm: true,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  })

  const avatarParams = computed((): Required<IPictureParams> => {
    return {
      bgAvatar: store.state.User.userInfo.avatarParams.bgAvatar,
      url: "" 
    } 
  });

  const asideBackgroundColor= ref(Colors.Grey as string);

  const userName = computed((): UserName => {
    const { firstName, lastName } = store.state.User.userInfo;
    return {
      firstName,
      lastName
    } 
  });

  // Save card methods.
  const saveBackgroundAvatar = () => {
    store.dispatch("updateUserBackgroundAvatar", {
      bgAvatar: avatarParams.value.bgAvatar,
      unicID: store.state.User.currentUser.uid
    }).then(() => {
      notify({
        title: "Фон вашего фото профиля был успешно обнолен!"
      })
    })
  }

  const saveAdditional = () => {
    store.dispatch("updateAdditionalParams", {
      additional: {
        ...additionalParams,
        asideBackgroundColor: asideBackgroundColor.value
      },
      unicID: store.state.User.currentUser.uid
    }).then(() => {
      notify({
        title: "Настройки конфигурации были успешно сохранены!"
      })

      if (!notificationAdded.value) {
        store.commit("setNewNotification", useNewNotificationContent(NotificationType.ConfigurationChange));
      }
      notificationAdded.value = true;
    })
  }

  const saveNavigationList = () => {
    store.dispatch("updateNavigateItem", {
      navigations: showedNavigations.map((item) => item.showed),
      unicID: store.state.User.currentUser.uid
    }).then(() => {
      notify({
        title: "Список отображаемых страниц был успешно сохранен!"
      })

      if (!notificationAdded.value) {
        store.commit("setNewNotification", useNewNotificationContent(NotificationType.ConfigurationChange));
      }
      notificationAdded.value = true;
    })
  }
  // Get info.
  watchEffect(() => {
    const unicID: string = store.state.User.currentUser?.uid;
    if (unicID) {
      store.dispatch("getUserConfiguration", unicID)
      .then((configuration: Omit<IConfiguration, "navigations">) => {
        
        const navigationList: IAsideNavigationItem[] = store.state.Configuration.asideNavigate
        showedNavigations.forEach((item, index) => item.showed = navigationList[index].showed);
      
        // Set additional params.
        asideBackgroundColor.value = configuration.asideBackgroundColor;

        additionalParams.showDeleteAccountButton = configuration.showDeleteAccountButton;
        additionalParams.showCurrentDate = configuration.showCurrentDate;
        additionalParams.showEmailConfirm = configuration.showEmailConfirm;
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
    saveBackgroundAvatar
  }
}

export default useConfiguration;