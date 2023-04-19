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
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import router from "@/router";
import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";
import { SelectElements } from "@/types";
import { useContainerProps } from "./use/props";

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  emits: ["user-menu-picked"],
  props: useContainerProps,
  setup(props, { emit }) {
    const store = useStore();

    const actions: SelectElements = reactive([
      {
        title: "Мой профиль",
        callback: () => router.push("/profile"),
        icon: require("@/assets/img/icons/account.svg"),
        variant: "default",
      },
      {
        title: "Выйти с аккаунта",
        callback: () => store.dispatch("userLogout"),
        icon: require("@/assets/img/icons/logout.svg"),
        variant: "danger",
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
    min-width: 135px;
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
