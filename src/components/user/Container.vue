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

import { SelectElements } from "@/types/index";
import Avatar from "@/components/user/Avatar.vue";
import Info from "@/components/user/Info.vue";
import router from "@/router";
import store from "@/store";

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
        title: "Редактировать аккаунт",
        callback: () => router.push("/profile"),
      },
      {
        title: "Выйти с аккаунта",
        callback: () => store.dispatch("userLogout"),
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
