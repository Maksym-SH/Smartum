<template>
  <div class="user-info">
    <Avatar online :first-name="firstName" :last-name="lastName" :avatar="avatar" />
    <div class="user-info__content">
      <UserData :first-name="firstName" :last-name="lastName" />
      <AppSelect :items="actions" rounded @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useContainerProps } from "./use/useProps";

import useSelectActions from "@/composables/useSelectActions";

import AppSelect from "../UI/AppSelect.vue";
import Avatar from "./AppAvatar.vue";
import UserData from "./UserData.vue";

export default defineComponent({
  components: {
    Avatar,
    AppSelect,
    UserData,
  },
  props: useContainerProps,
  emits: ["userMenuPicked"],
  setup() {
    const { actions, selected } = useSelectActions();

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
