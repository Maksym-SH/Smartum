<template>
  <div class="user-info">
    <Avatar
      online
      :firstName="firstName"
      :lastName="lastName" 
      :avatar="avatar"
    />
    <div class="user-info__content">
      <Info  
        :firstName="firstName" 
        :lastName="lastName" 
      />
      <Select :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";
import { SelectElements } from "@/types";
import { useContainerProps } from "./use/useProps";
import verifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import { User } from "@firebase/auth";

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  emits: ["user-menu-picked"],
  props: useContainerProps,
  setup(props, { emit }) {
    const store = useStore();

    const currentUser = computed((): User => store.state.User.currentUser);
    const emailVerified = computed((): boolean => currentUser.value.emailVerified);

    const actions = reactive<SelectElements>([
      {
        title: "Мой профиль",
        callback: () => router.push("/profile"),
        icon: "mdi-account",
        variant: "default",
        displaying: true,
      },
      {
        title: "Подтвердить адрес",
        callback: () => verifyEmail(currentUser.value),
        icon: "mdi-email-check-outline",
        variant: "info",
        displaying: !emailVerified.value // Not verified.
      },
      {
        title: "Выйти с аккаунта",
        callback: () => store.dispatch("userLogout"),
        icon: "mdi-logout",
        variant: "danger",
        displaying: true
      },
    ]);

    const selected = (callback: Function): void => {
      emit("user-menu-picked");
      callback();
    };

    return {
      actions,
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
      right: -40px;
      .c-button--round {
        img {
          width: 22px;
        }
      }
    }
  }
}
</style>
