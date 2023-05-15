<template>
  <div class="invite-users">
    <cButton @click="toggleInviteWindow">
      <span class="icon mdi mdi-account-multiple"></span>
      Пригласить
    </cButton>
    <transition name="toggle-content">
      <div v-if="showInviteWindow" class="invite-users__window">
        <header class="invite-users__window-header">
          <span class="invite-users__window--refresh" @click="refreshUsers">
            <span class="icon mdi mdi-refresh"></span>
            Обновить
          </span>
          <cButton
            class="invite-users__window--close"
            variant="text"
            @click="showInviteWindow = false"
          >
            <span class="mdi mdi-close"></span>
          </cButton>
        </header>
        <div
          class="invite-users__window-content"
          :class="{ 'is-refresh': showLoader }"
        >
          <cLoader v-show="showLoader" class="invite-load" inline />
          <div class="invite-users__user-list">
            <UserListItem
              v-for="user in usersList"
              :key="user.uid"
              :user-info="user"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { IUserForList } from "@/types/interfaces";

import UserListItem from "./UserItem.vue";
import useStore from "@/composables/useStores";

export default defineComponent({
  components: {
    UserListItem,
  },
  setup() {
    const { userStore } = useStore();

    const showInviteWindow = ref(false);

    const usersList = ref<IUserForList[]>([]);

    const showLoader = ref(true);

    const refreshUsers = () => {
      showLoader.value = true;
      usersList.value = [];

      userStore.getUsersList(true, false).then((list) => {
        usersList.value = list;
        showLoader.value = false;
      });
    };

    const toggleInviteWindow = () => {
      showInviteWindow.value = !showInviteWindow.value;

      if (!usersList.value.length) refreshUsers();
    };

    return {
      usersList,
      showLoader,
      showInviteWindow,
      refreshUsers,
      toggleInviteWindow,
    };
  },
});
</script>

<style lang="scss" scoped>
.invite-users {
  position: relative;
  .c-button {
    text-transform: none;
    color: $color-white1;
    display: flex;
    align-items: center;
    .icon {
      font-size: 20px;
    }
  }
  &__window {
    position: absolute;
    top: calc(100% + 15px);
    right: 0;
    width: 400px;
    border-radius: 4px;
    background-color: var(--color-background);
    &-header {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding: 10px;
      text-align: end;
      border-bottom: 1px solid var(--color-border-card);
    }
    &--close {
      color: var(--color-text) !important;
      font-size: 30px;
      padding: 0;
    }
    &--refresh {
      cursor: pointer;
      color: $color-blue;
      &:hover {
        color: $color-blue-hover;
      }
    }
    &-content {
      height: 305px;
      overflow-y: auto;
      &.is-refresh {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background: $color-grey;
      }

      &::-webkit-scrollbar-thumb {
        background-color: $color-light-grey;
      }
    }
  }
}
</style>
