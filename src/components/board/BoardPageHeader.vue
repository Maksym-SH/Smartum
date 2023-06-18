<template>
  <header class="board-header">
    <div class="board-header__wrapper">
      <router-link :to="{ name: 'Home' }" class="board-header__logo">
        <img class="board-header__logo-image" src="/images/icons/logo.svg" alt="" />
      </router-link>
      <div class="board-header__actions">
        <AcquaintanceButton />
        <BtnNotify />
        <SwitchTheme name="switchThemeBoard" />
        <AppSelect :items="actions" :size="42" rounded @selected="selected">
          <Avatar
            circle
            :first-name="userInfo.firstName"
            :last-name="userInfo.lastName"
            :avatar="userInfo.avatarParams"
          />
        </AppSelect>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, onMounted } from "vue";
import type { IUserCreated } from "@/types/interfaces";
import { Colors } from "@/types/enums";

import useSelectActions from "@/composables/useSelectActions";
import Avatar from "../user/AppAvatar.vue";
import BtnNotify from "@/components/notification/NotficaitonBtn.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";
import AcquaintanceButton from "./BoardAcquaintanceButton.vue";

export default defineComponent({
  components: {
    Avatar,
    BtnNotify,
    AcquaintanceButton,
    SwitchTheme,
  },
  emits: ["boardLeave", "userMenuPicked"],
  props: {
    userInfo: {
      type: Object as PropType<IUserCreated>,
      required: true,
    },
  },
  setup(_, { emit }) {
    const { selected, actions, addNewAction } = useSelectActions();

    onMounted(() => {
      addNewAction({
        title: "Покинуть доску",
        callback: () => emit("boardLeave"),
        icon: "clipboard-arrow-left-outline",
        color: Colors.Danger,
        displaying: true,
      });
    });

    return {
      actions,
      selected,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-header {
  width: 100%;
  padding: 10px;
  background-color: $color-dark-grey3;

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    width: 150px;
    display: flex;

    &-image {
      width: 100%;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @include mobile(max) {
    padding: 10px 8px 7px;

    &__logo {
      width: 100px;
    }
  }
}
</style>
