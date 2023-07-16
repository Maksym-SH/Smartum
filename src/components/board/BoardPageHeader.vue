<template>
  <header class="board-header">
    <div class="board-header__wrapper">
      <router-link :to="{ name: 'Home' }" class="board-header__logo">
        <img class="board-header__logo-image" src="/images/icons/logo.svg" alt="" />
      </router-link>
      <div class="board-header__actions">
        <SwitchLanguageButton title="" type="button" variant="tonal" />

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
import { computed, defineComponent, onMounted } from "vue";

import i18n from "@/i18n";
import useSelectActions from "@/composables/useSelectActions";

import Avatar from "../user/AppAvatar.vue";
import SwitchTheme from "../UI/SwitchTheme.vue";
import AppSelect from "../UI/AppSelect.vue";
import SwitchLanguageButton from "../UI/SwitchLanguageButton.vue";
import AcquaintanceButton from "./BoardAcquaintanceButton.vue";
import NotificationsButton from "@/components/notification/NotificationsButton.vue";

import type { PropType } from "vue";
import { Colors } from "@/types/enums";
import type { IUserCreated } from "@/types/interfaces/user";

export default defineComponent({
  components: {
    Avatar,
    NotificationsButton,
    AcquaintanceButton,
    SwitchTheme,
    SwitchLanguageButton,
    AppSelect,
  },
  props: {
    userInfo: {
      type: Object as PropType<IUserCreated>,
      required: true,
    },
  },
  emits: ["boardLeave", "userMenuPicked"],
  setup(_, { emit }) {
    const { t } = i18n.global;

    const { selected, actions, addNewAction } = useSelectActions();

    onMounted(() => {
      addNewAction({
        title: computed(() => t("buttons.leaveBoard")),
        callback: () => emit("boardLeave"),
        icon: "clipboard-arrow-left-outline",
        color: Colors.DANGER,
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
