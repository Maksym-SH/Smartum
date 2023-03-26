<template>
  <div class="user-info">
    <Avatar online :name="name" :image="avatar" />
    <div class="user-info__content">
      <Info :name="name" />
      <Select :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

import router from "@/router";
import store from "@/store";

import { SelectElements } from "@/types";

import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: null,
    },
  },
  setup() {
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

    const selected = (callback: Function) => callback();

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
    min-width: 130px;

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
