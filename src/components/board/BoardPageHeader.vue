<template>
  <header class="board-header">
    <div class="board-header__wrapper">
      <router-link :to="{ name: 'Home' }" class="board-header__logo">
        <img class="board-header__logo-image" src="/images/icons/logo.svg" alt="" />
      </router-link>
      <div class="board-header__actions">
        <SwitchLanguageButton :title="''" type="button" variant="tonal" />
        <AcquaintanceButton />
        <NotificationsButton />
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
import { defineComponent, onMounted, computed } from "vue";
import type { IUserCreated } from "@/types/interfaces";
import { Colors } from "@/types/enums";

import i18n from "@/i18n";
import useSelectActions from "@/composables/useSelectActions";
import Avatar from "../user/AppAvatar.vue";
import NotificationsButton from "@/components/notification/NotificationsButton.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";
import AcquaintanceButton from "./BoardAcquaintanceButton.vue";
import SwitchLanguageButton from "../UI/SwitchLanguageButton.vue";

export default defineComponent({
  components: {
    Avatar,
    NotificationsButton,
    AcquaintanceButton,
    SwitchTheme,
    SwitchLanguageButton,
  },
  emits: ["boardLeave", "userMenuPicked"],
  props: {
    userInfo: {
      type: Object as PropType<IUserCreated>,
      required: true,
    },
  },
  setup(_, { emit }) {
    const { t } = i18n.global;

    const { selected, actions, addNewAction } = useSelectActions();

    onMounted(() => {
      addNewAction({
        title: computed(() => t("buttons.leaveBoard")),
        callback: () => emit("boardLeave"),
        icon: "clipboard-arrow-left-outline",
        color: Colors.Danger,
        displaying: true,
        active: false,
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

    .switch-language {
      width: 34px;
    }
  }

  @include mobile(max) {
    padding: 10px 8px 7px;

    &__logo {
      width: 100px;
    }
  }

  @include responsive($us, max) {
    padding: 5px;

    &__logo {
      width: 80px;
    }

    &__actions {
      gap: 6px;
    }
  }
}
</style>
