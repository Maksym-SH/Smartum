import { computed, onMounted, reactive, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { Colors, NotificationType } from "@/types/enums";
import type { UserName } from "@/types/types";
import type {
  IAsideNavigationItem,
  IConfiguration,
  IConfigurationAdditional,
  IPictureParams,
  IUserInfo,
} from "@/types/interfaces";

import i18n from "@/i18n";
import useNewNotificationContent from "./useNotificationContent";
import useStores from "./useStores";
import useAsideNavigation from "@/composables/useAsideNavigation";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";

export default function useConfiguration() {
  const { t } = i18n.global;

  const { userStore, configurationStore, notificationStore } = useStores();

  const { unicID } = useCurrentUserInfo();

  const showedNavigations = ref<IAsideNavigationItem[]>([...useAsideNavigation()]);

  const notificationAdded = ref(false);

  // Params
  const additionalParams = reactive<IConfigurationAdditional>({
    showEmailConfirm: true,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  });

  const avatarParams = reactive<Required<IPictureParams>>({
    bgAvatar: "",
    url: "",
  });

  const asideBackgroundColor = ref(Colors.Grey as string);

  const userName = computed((): UserName => {
    const { firstName, lastName } = userStore.userInfo as Required<IUserInfo>;
    return {
      firstName,
      lastName,
    };
  });

  // Save card methods.
  const saveBackgroundAvatar = () => {
    userStore.updateUserBackgroundAvatar(avatarParams.bgAvatar, unicID.value).then(() => {
      userStore.updateUsersList({ ...userStore.userInfo, uid: unicID.value });
      notify({
        title: t("notify.saveBackgroundAvatar.title"),
      });
    });
  };

  const saveAdditional = () => {
    configurationStore
      .updateAdditionalParams(
        {
          ...additionalParams,
          asideBackgroundColor: asideBackgroundColor.value,
        },
        unicID.value
      )
      .then(() => {
        notify({
          title: t("notify.savedConfigurationSuccess.title"),
        });

        if (!notificationAdded.value) {
          const notification = useNewNotificationContent(
            NotificationType.ConfigurationChange
          );

          notificationStore.setNewNotification(notification);
        }
        notificationAdded.value = true;
      });
  };

  const saveNavigationList = () => {
    const navigations = showedNavigations.value.map((item) => item.showed);

    configurationStore.updateNavigateItem(navigations, unicID.value).then(() => {
      notify({
        title: t("notify.savedShowingPages.title"),
      });

      if (!notificationAdded.value) {
        const notification = useNewNotificationContent(
          NotificationType.ConfigurationChange
        );

        notificationStore.setNewNotification(notification);
      }

      notificationAdded.value = true;
    });
  };

  // Get info.
  onMounted(() => {
    configurationStore
      .getUserConfiguration(unicID.value)
      .then((configuration: Omit<IConfiguration, "navigations">) => {
        const navigationList: IAsideNavigationItem[] = configurationStore.asideNavigate;
        showedNavigations.value.forEach(
          (item, index) => (item.showed = navigationList[index].showed)
        );

        // Set backgrond avatar.
        const currentBackgrondAvatar = userStore.userInfo.avatarParams
          .bgAvatar as Required<string>;
        avatarParams.bgAvatar = currentBackgrondAvatar;

        // Set additional params.
        asideBackgroundColor.value = configuration.asideBackgroundColor;

        additionalParams.showDeleteAccountButton = configuration.showDeleteAccountButton;
        additionalParams.showCurrentDate = configuration.showCurrentDate;
        additionalParams.showEmailConfirm = configuration.showEmailConfirm;
      });
  });

  return {
    additionalParams,
    asideBackgroundColor,
    userName,
    avatarParams,
    showedNavigations,
    saveNavigationList,
    saveAdditional,
    saveBackgroundAvatar,
  };
}
