import type { ComponentInternalInstance } from "vue";
import { computed, getCurrentInstance, reactive } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { Colors } from "@/types/enums";
import type { SelectElements } from "@/types/types";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import router from "@/router";
import useStores from "./useStores";
import { ISelectElem } from "@/types/interfaces";

export default function useSelectActions() {
  const { userStore } = useStores();

  const { currentUser } = useCurrentUserInfo();

  const { emit } = getCurrentInstance() as ComponentInternalInstance;

  const emailVerified = computed((): boolean => currentUser.value.emailVerified);

  const selected = (callback: Function): void => {
    emit("userMenuPicked");
    callback();
  };

  const actions = reactive<SelectElements>([
    {
      title: "Мой профиль",
      callback: () => router.push("/profile"),
      icon: "mdi-account",
      color: Colors.Default,
      displaying: true,
    },
    {
      title: "Подтвердить адрес",
      callback: () => verifyEmail(currentUser.value),
      icon: "mdi-email-check-outline",
      color: Colors.Info,
      displaying: computed(() => !emailVerified.value), // Not verified.
    },
    {
      title: "Выйти с аккаунта",
      callback: () => {
        userStore.userLogout().then(() => {
          notify({
            title: "До скорого!",
          });
        });
      },
      icon: "mdi-logout",
      color: Colors.Danger,
      displaying: true,
    },
  ]);

  const addNewAction = (action: Required<ISelectElem>) => {
    const displaying = action.displaying as boolean;

    actions.push({ ...action, displaying });
  };

  return {
    actions,
    addNewAction,
    selected,
  };
}
