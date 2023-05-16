<template>
  <div class="invite-users">
    <cButton @click="toggleInviteWindow">
      <span class="icon mdi mdi-account-multiple"></span>
      Пригласить
    </cButton>
    <transition name="toggle-content">
      <div v-if="showInviteWindow" class="invite-users__window">
        <header class="invite-users__window-header">
          <div class="invite-users__window-header--search">
            <cInput
              v-model="searchText"
              label="Поиск"
              type="search"
              name="searchUsers"
              @search="searchUser"
            />
          </div>
          <div class="invite-users__window-header--actions">
            <cButton
              variant="text"
              class="invite-users__window--refresh"
              @click="refreshUsers"
            >
              <span class="icon mdi mdi-refresh"></span>
            </cButton>
            <cButton
              class="invite-users__window--close"
              variant="text"
              @click="showInviteWindow = false"
            >
              <span class="mdi mdi-close"></span>
            </cButton>
          </div>
        </header>
        <div
          class="invite-users__window-content"
          :class="{ 'is-refresh': showLoader }"
        >
          <cLoader v-show="showLoader" class="invite-load" inline />
          <div class="invite-users__user-list">
            <UserListItem
              v-if="filteredList.length"
              v-for="user in filteredList"
              :key="user.uid"
              :user-info="user"
              @invite="invite(user)"
            />
            <transition name="toggle-content">
              <div
                v-if="!filteredList.length && !showLoader"
                class="invite-users__window-content--empty"
              >
                Ничего не найдено
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import useStore from "@/composables/useStores";
import type {
  INotification,
  IServerDate,
  IUserForList,
  IWorkingBoardItem,
} from "@/types/interfaces";
import useUserInfo from "@/composables/useCurrentUserInfo";
import UserListItem from "./UserItem.vue";
import { OpenPopup } from "@/helpers/methods";
import { Colors, NotificationType } from "@/types/enums";
import useNewNotificationContent from "@/composables/useNotificationContent";
import { notify } from "@kyvg/vue3-notification";
import { computed } from "@vue/reactivity";

export default defineComponent({
  components: {
    UserListItem,
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

    const searchUser = () => {
      isSearching.value = true;
      if (searchText.value) {
        usersListFiltered.value = usersList.value.filter(
          (item) =>
            item.firstName
              .toLowerCase()
              .includes(searchText.value.toLowerCase()) ||
            item.lastName.toLowerCase().includes(searchText.value.toLowerCase())
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
          notificationStore
            .getAllNotifications(invitedUser.uid)
            .then((list) => {
              const notificationList: INotification<IServerDate | Date>[] =
                list;

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
    border-radius: 4px 4px 0 0;
    box-shadow: 0 20px 40px rgba($color-black, 0.4);
    background-color: $color-black;
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 20px 10px 10px;
      text-align: end;
      border-bottom: 1px solid $color-white1;
      &--actions {
        display: flex;
      }
      &--search {
        .c-input {
          padding: 0;
        }
      }
    }
    &--close {
      color: $color-white1 !important;
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
    &-content {
      position: relative;
      height: 355px;
      overflow: hidden scroll;
      &.is-refresh {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      &--empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: $color-white1;
      }

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background: $color-black;
      }

      &::-webkit-scrollbar-thumb {
        background-color: $color-light-grey;
      }
    }
  }
  @include mobile(max) {
    &__window {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 3;
      border-radius: 0;
      &-content {
        height: 100%;
      }
    }
  }
}
</style>
