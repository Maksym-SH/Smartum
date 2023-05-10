<template>
  <div class="user-info">
    <Avatar
      online
      :firstName="firstName"
      :lastName="lastName"
      :avatar="avatar"
    />
    <div class="user-info__content">
      <Info :firstName="firstName" :lastName="lastName" />
      <Select :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { SelectElements } from "@/types/types";
import { useContainerProps } from "./use/useProps";
import { notify } from "@kyvg/vue3-notification";
import { Colors } from "@/types/enums";

import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import router from "@/router";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useStores from "@/composables/useStores";
import Avatar from "./Avatar.vue";
import Info from "./Info.vue";

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  emits: ["user-menu-picked"],
  props: useContainerProps,
  setup(_, { emit }) {
    const { userStore } = useStores();

    const { currentUser } = useCurrentUserInfo();
    const emailVerified = computed(
      (): boolean => currentUser.value.emailVerified
    );

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

    const selected = (callback: Function): void => {
      emit("user-menu-picked");
      callback();
    };

    return {
      actions,
      emailVerified,
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  .user-avatar {
    margin-right: 16px;
  }
  &__content {
    position: relative;
    min-width: 137px;
    :deep(.c-select) {
      position: absolute;
      top: 2px;
      right: -30px;
      .c-button--round {
        img {
          width: 22px;
        }
      }
    }
  }
}
</style>
