import { watchEffect, reactive, ref, computed } from "vue";
import { useStore } from "vuex";
import useAsideNavigation from "@/composables/useAsideNavigation";
import { notify } from '@kyvg/vue3-notification';
import { Colors } from '@/enums';
import { UserName } from "@/types";
import { 
  IAsideNavigationItem, 
  IConfiguration, 
  IConfigurationAdditional, 
  IPictureParams 
} from '@/interfaces';

const useConfiguration = () => {
  const store = useStore();

  const showedNavigations = reactive<IAsideNavigationItem[]>([
    ...useAsideNavigation()
  ]);

  const additionalParams = reactive<IConfigurationAdditional>({
    showEmailConfirm: true,
    showCurrentDate: false, // Time and date in app header.
    showDeleteAccountButton: false,
  })
  const asideBackgroundColor= ref(Colors.Grey as string);

  const avatarParams: Required<IPictureParams> = reactive({
    bgAvatar:"",
    url: "" 
  })
  const userName = computed((): UserName => {
    const { firstName, lastName } = store.state.User.userInfo;
    return {
      firstName,
      lastName
    } 
  });

  const saveBackgroundAvatar = () => {
    store.dispatch("updateUserBackgroundAvatar", {
      bgAvatar: avatarParams.bgAvatar,
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
    })
  }

  const saveNavigationList = () => {
    store.dispatch("updateNavigateItem", {
      navigations: showedNavigations.map((item) => item.showed),
      unicID: store.state.User.currentUser.uid
    })
  }

  watchEffect(() => {
    const unicID: string = store.state.User.currentUser?.uid;
    if (unicID) {
      store.dispatch("getUserConfiguration", unicID)
      .then((configuration: Omit<IConfiguration, "navigations">) => {
        
        const navigationList: IAsideNavigationItem[] = store.state.Configuration.asideNavigate
        showedNavigations.forEach((item, index) => item.showed = navigationList[index].showed);

        avatarParams.bgAvatar = store.state.User.userInfo.avatarParams.bgAvatar; // Set background avatar.
      
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