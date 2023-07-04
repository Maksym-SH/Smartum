import type { ComponentInternalInstance } from "vue";
import { computed, getCurrentInstance, reactive } from "vue";
import { notify } from "@kyvg/vue3-notification";

import i18n from "@/i18n";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import router from "@/router";
import useStores from "./useStores";

import { Colors, Route } from "@/types/enums";
import type { SelectElements } from "@/types/types";
import { ISelectElem } from "@/types/interfaces/components";

export default function useSelectActions() {
  const { t } = i18n.global;

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
      title: computed(() => t("buttons.myProfile")),
      callback: () => router.push({ name: Route.PROFILE }),
      icon: "account",
      color: Colors.DEFAULT,
      displaying: true,
    },
    {
      title: computed(() => t("buttons.emailConfirm")),
      callback: () => verifyEmail(currentUser.value),
      icon: "email-check-outline",
      color: Colors.INFO,
      displaying: computed(() => !emailVerified.value), // Not verified.
    },
    {
      title: computed(() => t("buttons.signOut")),
      callback: () => {
        userStore.userLogout().then(() => {
          notify({
            title: t("notify.signOut.title"),
            type: "success",
          });
        });
      },
      icon: "logout",
      color: Colors.DANGER,
      displaying: true,
    },
  ]);

  const addNewAction = (action: Required<ISelectElem>) => {
    const title = action.title as string;
    const displaying = action.displaying as boolean;
    const active = action.active as boolean;

    actions.push({ ...action, title, displaying, active });
  };

  return {
    actions,
    addNewAction,
    selected,
  };
}
