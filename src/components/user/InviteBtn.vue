<template>
  <div class="invite-users">
    <cButton
      @click="toggleInviteWindow"
      icon="mdi-account-multiple"
      class="invite-users__btn"
    >
      Пригласить
    </cButton>
    <DropDownWindow
      :visible="showInviteWindow"
      class="invite-users__window"
      :width="375"
      :height="385"
      :centering="showLoader || emptyList"
      @hide-dropdown="showInviteWindow = false"
    >
      <template #header>
        <div class="invite-users__window-header">
          <div class="invite-users__window-header--search">
            <cInput
              v-model="searchText"
              placeholder="Поиск"
              type="search"
              name="searchUsers"
              @search="searchUser"
            />
          </div>
          <nav class="invite-users__window-header--actions">
            <cButton
              variant="text"
              class="invite-users__window--refresh"
              icon="mdi-refresh"
              @click="refreshUsers"
            />
            <cButton
              class="invite-users__window--close"
              variant="text"
              icon="mdi-close"
              @click="showInviteWindow = false"
            />
          </nav>
        </div>
      </template>
      <template #content>
        <div v-if="showInviteWindow" class="invite-users__window">
          <div class="invite-users__window-content">
            <cLoader v-show="showLoader" class="invite-load" inline />
            <div class="invite-users__user-list">
              <UserListItem
                v-if="filteredList.length"
                v-for="user in filteredList"
                :key="user.uid"
                :user-info="user"
                @invite="invite(user)"
              />
              <div
                v-show="!filteredList.length && !showLoader"
                class="invite-users__window-content--empty"
              >
                Ничего не найдено
              </div>
            </div>
          </div>
        </div>
      </template>
    </DropDownWindow>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, computed } from "vue";
import useStore from "@/composables/useStores";
import type {
  INotification,
  IServerDate,
  IUserForList,
  IWorkingBoardItem,
} from "@/types/interfaces";
import { notify } from "@kyvg/vue3-notification";
import { OpenPopup } from "@/helpers/methods";
import { Colors, NotificationType } from "@/types/enums";

import useNewNotificationContent from "@/composables/useNotificationContent";
import useUserInfo from "@/composables/useCurrentUserInfo";
import UserListItem from "./UserItem.vue";
import DropDownWindow from "@/container/DropdownWindow.vue";

export default defineComponent({
  components: {
    UserListItem,
    DropDownWindow,
  },
  props: {
    board: {
      type: Object as PropType<IWorkingBoardItem | {}>,
      required: true,
    },
  },
  setup(props) {
    const { userStore, notificationStore } = useStore();

    const { unicID } = useUserInfo();

    const showInviteWindow = ref(false);

    const usersList = ref<IUserForList[]>([]);
    const usersListFiltered = ref<IUserForList[]>([]);

    const showLoader = ref(true);

    // Search
    const searchText = ref("");
    const isSearching = ref(false);

    const emptyList = computed(() => !filteredList.value.length && !showLoader.value);

    const searchUser = () => {
      isSearching.value = true;
      if (searchText.value) {
        usersListFiltered.value = usersList.value.filter((item) =>
          getFullName(item).toLowerCase().includes(searchText.value.toLowerCase())
        );
      } else {
        isSearching.value = false;
      }
    };

    const filteredList = computed((): IUserForList[] => {
      if (isSearching.value) {
        return usersListFiltered.value;
      }
      return usersList.value;
    });

    // Window actions.
    const refreshUsers = () => {
      showLoader.value = true;
      usersList.value = [];

      userStore.getUsersList(true, false).then((list) => {
        const board = props.board as IWorkingBoardItem;

        usersList.value = list;

        // Set admin role
        const adminRole = usersList.value.find(
          (item) => item.uid === board.members[0].uid // 0 - board creator index.
        );
        if (adminRole) {
          adminRole.role = "Администратор";
        }

        // Set member role.
        const memberRole = usersList.value.find((item) => {
          const my = board.members.findIndex((user) => user.uid === item.uid);
          return my === -1 ? false : my;
        });
        if (memberRole) {
          memberRole.role = "Участник";
        }

        // Show me in the first place.
        usersList.value.sort((a) => {
          if (a.uid === unicID.value) return -1;
          return 0;
        });

        showLoader.value = false;
      });
    };

    const toggleInviteWindow = () => {
      showInviteWindow.value = !showInviteWindow.value;

      if (!usersList.value.length) refreshUsers();
    };

    const getFullName = (user: IUserForList) => {
      return `${user.firstName} ${user.lastName ? user.lastName : ""}`;
    };

    const invite = (invitedUser: IUserForList) => {
      OpenPopup({
        title: "Приглашение в рабочее пространство",
        text: `Вы уверены, что хотите пригласить пользователя "${getFullName(
          invitedUser
        )}"? Пользователь получит уведомление о приглашении.`,
        buttons: {
          yes: {
            text: "Пригласить",
            color: Colors.Success,
          },
        },
        callback: (): void => {
          notificationStore.getAllNotifications(invitedUser.uid).then((list) => {
            const notificationList: INotification<IServerDate | Date>[] = list;

            const board = props.board as IWorkingBoardItem;

            const notificationToSend = useNewNotificationContent(
              NotificationType.InviteToBoard,
              board.title,
              board
            );
            notificationList.push(notificationToSend);
            notificationStore
              .updateNotificationList(invitedUser.uid, notificationList)
              .then(() =>
                notify({
                  title: "Успешно!",
                  text: "Приглашение в рабочее пространство было отправлено!",
                  type: "success",
                })
              );
          });
        },
      });
    };

    return {
      searchText,
      usersList,
      showLoader,
      showInviteWindow,
      filteredList,
      emptyList,
      searchUser,
      invite,
      refreshUsers,
      toggleInviteWindow,
    };
  },
});
</script>

<style lang="scss" scoped>
.invite-users {
  position: relative;
  &__btn {
    text-transform: none;
    color: $color-white1;
    display: flex;
    align-items: center;
    .icon {
      font-size: 20px;
    }
  }
  &__window {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 5px;
      text-align: end;
      &--actions {
        display: flex;
        gap: 5px;
        .c-button {
          padding: 0 5px;
        }
      }
      &--search {
        .c-input {
          padding: 0;
        }
      }
    }
    &-content {
      &--empty {
        color: var(--color-text);
      }
    }
    &--close {
      color: var(--color-text) !important;
      font-size: 25px;
      padding: 0;
    }
    &--refresh {
      font-size: 20px;
      padding: 5px;
      cursor: pointer;
      color: $color-blue;
      &:hover {
        color: $color-blue-hover;
      }
    }
  }
}
</style>
