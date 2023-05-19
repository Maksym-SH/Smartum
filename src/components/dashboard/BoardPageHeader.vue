<template>
  <header class="board-header">
    <div class="board-header__wrapper">
      <router-link :to="{ name: 'Home' }" class="board-header__logo">
        <img class="board-header__logo-image" src="/images/icons/logo.svg" alt="" />
      </router-link>
      <div class="board-header__actions">
        <AcquaintanceBtn />
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
import type { IUserCreated } from "@/types/interfaces";

import useSelectActions from "@/composables/useSelectActions";
import Avatar from "../user/Avatar.vue";
import BtnNotify from "@/components/notification/NotficaitonBtn.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";
import AcquaintanceBtn from "./AcquaintanceBtn.vue";

export default defineComponent({
  components: {
    Avatar,
    BtnNotify,
    AcquaintanceBtn,
    SwitchTheme,
  },
  props: {
    userInfo: {
      type: Object as PropType<IUserCreated>,
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
