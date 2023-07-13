<template>
  <div class="invite-users">
    <AppButton
      icon="account-multiple"
      class="invite-users__btn"
      size="small"
      :title="$t('buttons.invite')"
      @click="toggleInviteWindow"
    />
    <DropDownWindow
      :visible="showInviteWindow"
      class="invite-users__window"
      :width="375"
      :height="320"
      :centering="showLoader || emptyList"
      @hide-dropdown="showInviteWindow = false"
    >
      <template #header>
        <div class="invite-users__window-header">
          <div class="invite-users__window-header--search">
            <AppInput
              v-model="searchText"
              placeholder="Поиск"
              type="search"
              name="searchUsers"
              @search="searchUser"
            />
          </div>
          <nav class="invite-users__window-header--actions">
            <AppButton
              variant="text"
              class="invite-users__window--refresh"
              icon="refresh"
              @click="refreshUsers"
            />
            <AppButton
              class="invite-users__window--close"
              variant="text"
              icon="close"
              @click="showInviteWindow = false"
            />
          </nav>
        </div>
      </template>
      <template #content>
        <div v-if="showInviteWindow" class="invite-users__window">
          <div class="invite-users__window-content">
            <AppLoader v-show="showLoader" class="invite-load" inline />
            <div v-show="!showLoader" class="invite-users__user-list">
              <template v-if="filteredList.length">
                <UserListItem
                  v-for="user in filteredList"
                  :key="user.uid"
                  :user-info="user"
                  @invite="invite(user)"
                />
              </template>
              <div v-show="!filteredList.length" class="invite-users__window-content--empty">
                {{ $t("emptyList.noData") }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </DropDownWindow>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { computed, defineComponent, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import UserListItem from "./UserItem.vue";
import { OpenPopup } from "@/helpers/methods";

import i18n from "@/i18n";
import useStore from "@/composables/useStores";
import useUserInfo from "@/composables/useCurrentUserInfo";
import useNewNotificationContent from "@/composables/useNotificationContent";
import DropDownWindow from "@/components/container/DropdownWindow.vue";

import { Colors, NotificationType } from "@/types/enums";
import type { INotification } from "@/types/interfaces/components";
import type { IUserForList } from "@/types/interfaces/user";
import type { IWorkingBoardItem } from "@/types/interfaces/board";

export default defineComponent({
  components: {
    UserListItem,
    DropDownWindow,
  },
  props: {
    board: {
      type: Object as PropType<IWorkingBoardItem>,
      required: true,
    },
  },
  emits: ["invited"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const { userStore, notificationStore } = useStore();

    const showInviteWindow = ref(false);

    const showLoader = ref(true);

    const { getFullName } = useUserInfo();
    const usersList = ref<IUserForList[]>([]);
    const usersListFiltered = ref<IUserForList[]>([]);

    // Search
    const searchText = ref("");
    const isSearching = ref(false);

    const filteredList = computed((): IUserForList[] => {
      if (isSearching.value) {
        return usersListFiltered.value;
      }

      return usersList.value;
    });

    const emptyList = computed((): boolean => !filteredList.value.length && !showLoader.value);

    const searchUser = (): void => {
      isSearching.value = true;
      if (searchText.value) {
        usersListFiltered.value = usersList.value.filter((item) =>
          getFullName(item).toLowerCase().includes(searchText.value.toLowerCase())
        );
      } else {
        isSearching.value = false;
      }
    };

    // Set roles.
    const setAdminRole = (list: IUserForList[]): void => {
      const adminRole = list.find(
        (item) => item.uid === props.board.members[0].uid // 0 - board creator index.
      );
      if (adminRole) {
        adminRole.role = computed(() => t("role.admin"));
      }
    };

    const setUserRoles = (list: IUserForList[]): void => {
      const boardMembers = list.filter((item) => {
        const member = props.board.members.find((user) => user.uid === item.uid);

        return member ?? false;
      });

      if (boardMembers.length) {
        list.forEach((user) => {
          if (boardMembers.includes(user)) {
            const invitedUsers = props.board.members.filter((item) => item.invited);

            const currentUserInvited = invitedUsers.find((invited) => invited.uid === user.uid);

            if (currentUserInvited) {
              user.invited = true;
            }
            // Not admin.
            else if (user.uid !== props.board.members[0].uid) {
              user.role = computed(() => t("role.member"));
            }
          }
        });
      }
    };

    // Window actions.
    const refreshUsers = (): void => {
      showLoader.value = true;
      usersList.value = [];

      userStore.getUsersList(true, false).then((list) => {
        usersList.value = list;

        setAdminRole(list);

        setUserRoles(list);

        // Show all members first.
        usersList.value.sort((user) => {
          return user.role ? -1 : 0;
        });

        showLoader.value = false;
      });
    };

    const toggleInviteWindow = (): void => {
      showInviteWindow.value = !showInviteWindow.value;

      if (!usersList.value.length) {
        refreshUsers();
      }
    };

    const invite = (invitedUser: IUserForList): void => {
      OpenPopup({
        title: t("popup.invite.title"),
        text: t("popup.invite.text", {
          name: getFullName(invitedUser),
        }),
        buttons: {
          yes: {
            text: t("buttons.invite"),
            color: Colors.SUCCESS,
          },
        },
        callback: (): void => {
          notificationStore.getAllNotifications(invitedUser.uid).then((list) => {
            const notificationList: INotification[] = list;

            const board = props.board as IWorkingBoardItem;

            const notificationToSend = useNewNotificationContent(
              NotificationType.INVITE_TO_BOARD,
              board.title,
              board
            );
            notificationList.unshift(notificationToSend);
            notificationStore
              .updateNotificationList(invitedUser.uid, notificationList)
              .then(() => {
                notify({
                  title: t("common.success"),
                  text: t("notify.invitationSuccessful.text"),
                  type: "success",
                });

                // Update status for invited user.
                invitedUser.invited = true;

                emit("invited", {
                  uid: invitedUser.uid,
                  invited: true,
                });
              });
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
    width: 115px;
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
