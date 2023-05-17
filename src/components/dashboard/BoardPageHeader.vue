<template>
  <header class="board-header">
    <div class="board-header__wrapper">
      <router-link :to="{ name: 'Home' }" class="board-header__logo">
        <img src="/images/icons/logo.svg" alt="" />
      </router-link>
      <div class="board-header__actions">
        <BtnInviteUsers :board="board" />
        <BtnNotify />
        <SwitchTheme name="switchThemeBoard" />
        <cSelect :items="actions" :size="42" rounded @selected="selected">
          <Avatar
            circle
            :first-name="userInfo.firstName"
            :last-name="userInfo.lastName"
            :avatar="userInfo.avatarParams"
          />
        </cSelect>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";
import type { IUserCreated, IWorkingBoardItem } from "@/types/interfaces";

import Avatar from "../user/Avatar.vue";
import BtnInviteUsers from "../user/Invite.vue";
import useSelectActions from "@/composables/useSelectActions";
import BtnNotify from "@/components/notification/NotficaitonBtn.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";

export default defineComponent({
  components: {
    Avatar,
    BtnNotify,
    SwitchTheme,
    BtnInviteUsers,
  },
  props: {
    userInfo: {
      type: Object as PropType<IUserCreated>,
      required: true,
    },
    board: {
      type: Object as PropType<IWorkingBoardItem | {}>,
      required: true,
    },
  },
  setup() {
    const { selected, actions } = useSelectActions();

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
  box-shadow: 0 10px 10px $color-transp-black;
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__logo {
    width: 150px;
  }
  &__actions {
    display: flex;
    align-items: center;
    gap: 20px;
  }
}
</style>
