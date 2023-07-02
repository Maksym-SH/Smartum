<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" @board-leave="boardLeave" />
    <div class="board-item-page__content" :style="{ background: boardBackground }">
      <AppLoader v-if="!showedCommonLoader && !boardNotEmpty" />
      <transition name="toggle-content">
        <div v-if="boardNotEmpty" class="board-item-page__board-info">
          <div class="board-item-page__board-info-about">
            <h3 class="board-item-page__name">
              {{ boardItem.title }}
            </h3>
            <p class="board-item-page__members-count">
              {{ $t("common.boardMembersInfo") }} {{ membersCount }}
            </p>
          </div>
          <div class="board-item-page__board-info--additional">
            <div class="avatars-wrapper">
              <v-tooltip
                :text="getFullName(item)"
                location="left"
                v-for="item in boardMembers"
                :key="item.uid"
              >
                <template v-slot:activator="{ props }">
                  <Avatar
                    v-if="!item.invited"
                    :avatar="item.avatarParams"
                    :first-name="item.firstName"
                    :last-name="item.lastName"
                    :size="30"
                    :class="{ admin: item.role === 'Admin' }"
                    v-bind="props"
                    circle
                  />
                </template>
              </v-tooltip>
            </div>
            <InviteUserButton :board="boardItem" @invited="setInviteUserToBoard" />
          </div>
        </div>
      </transition>
      <transition-group
        tag="div"
        name="smooth-height"
        mode="out-in"
        class="board-item-page__content-tasks"
      >
        <TaskColumn
          v-for="column in boardItem.columns"
          :key="column.id"
          :column="column"
          v-model:column-title="column.title"
          v-model:column-tasks="column.tasks"
          @save-changes="saveChanges"
        />
        <AddNewColumn
          v-show="boardNotEmpty"
          key="add-new"
          :column-length="columnLength"
          @createColumn="createColumn"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import type {
  IWorkingBoardItem,
  IWorkingBoardMember,
  IWorkingBoardTaskColumn,
} from "@/types/interfaces";
import { ObjectNotEmpty, OpenPopup } from "@/helpers/methods";
import { Colors } from "@/types/enums";
import { notify } from "@kyvg/vue3-notification";
import { storeToRefs } from "pinia";

import i18n from "@/i18n";
import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import BoardHeader from "@/components/board/BoardPageHeader.vue";
import InviteUserButton from "@/components/user/UserInviteButton.vue";
import Avatar from "@/components/user/AppAvatar.vue";
import TaskColumn from "@/components/board/task/TaskColumn.vue";
import AddNewColumn from "@/components/board/task/TaskColumnAddNew.vue";

export default defineComponent({
  components: {
    BoardHeader,
    Avatar,
    InviteUserButton,
    TaskColumn,
    AddNewColumn,
  },
  setup() {
    const { t } = i18n.global;

    const router = useRouter();

    const { commonStore, dashboardStore } = useStore();

    const showedCommonLoader = computed((): boolean => {
      return commonStore.loadingStatus;
    });

    const { unicID, userInfo, getFullName } = useCurrentUserInfo();

    const { boardItem, boardMembers } = storeToRefs(dashboardStore);

    const membersCount = computed((): number => {
      return boardItem.value.members.filter((member) => !member.invited).length;
    });

    const boardNotEmpty = computed((): boolean => {
      return ObjectNotEmpty(boardItem.value);
    });

    const boardBackground = computed((): string => {
      if (
        boardItem.value.background &&
        boardItem.value.background.match("dashboardTemplates")
      ) {
        return `url(${boardItem.value.background})`;
      }

      return boardItem.value.background;
    });

    const setInviteUserToBoard = (user: IWorkingBoardMember): void => {
      boardItem.value.members.push(user);
      dashboardStore.updateWorkingBoard(boardItem.value, false);
    };

    const boardLeave = () => {
      const currentMember = boardItem.value.members.find(
        (member) => member.uid === unicID.value
      );
      if (currentMember) {
        OpenPopup({
          title: t("popup.boardLeaveMessage.title"),
          text: leaveMessage(currentMember),
          buttons: {
            yes: {
              text: t("buttons.leave"),
              color: Colors.Danger,
            },
          },
          callback: (): void => {
            dashboardStore.leaveWorkingBoard(currentMember, boardItem.value).then(() => {
              notify({
                title: t("notify.leavedBoardSuccess.title"),
                text: t("notify.leavedBoardSuccess.text"),
                type: "success",
              });
            });
          },
        });
      }
    };

    const leaveMessage = (currentMember: IWorkingBoardMember): string => {
      const nextUserIsMember = !boardItem.value.members[1]?.invited;

      if (
        // Is Admin and members more than 1.
        currentMember.uid === boardItem.value.uid &&
        boardItem.value.members.length > 1 &&
        nextUserIsMember
      ) {
        return t("popup.boardLeaveMessage.admin");
      } else {
        // Is member.
        return t("popup.boardLeaveMessage.member");
      }
    };

    // Tasks
    const createColumn = (column: IWorkingBoardTaskColumn): void => {
      boardItem.value.columns.push(column);
      saveChanges();
    };

    const columnLength = computed((): number => {
      return boardItem.value.columns?.length || 0;
    });

    const saveChanges = (): void => {
      dashboardStore.updateWorkingBoard(boardItem.value, false);
    };

    onMounted((): void => {
      const joinCode = router.currentRoute.value.params.code as string;

      dashboardStore.getWorkingBoardItem(unicID.value, joinCode).catch(() => {
        router.push({ name: "Dashboard" });
      });
    });

    onBeforeUnmount(() => {
      boardItem.value = {} as IWorkingBoardItem;
    });

    return {
      membersCount,
      boardNotEmpty,
      boardBackground,
      boardItem,
      boardMembers,
      userInfo,
      showedCommonLoader,
      columnLength,
      boardLeave,
      getFullName,
      saveChanges,
      setInviteUserToBoard,
      createColumn,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-item-page {
  height: 100%;
  min-height: 550px;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;

  &__name,
  &__members-count {
    color: $color-white5;
  }

  &__name {
    word-break: break-word;
    font-size: 16px;
  }

  &__content {
    width: 100%;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
    background-attachment: fixed !important;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto 1fr;
    padding-bottom: 10px;

    &-tasks {
      margin-top: 20px;
      padding: 10px;
      max-width: 100%;
      width: 100%;
      display: flex;
      gap: 10px;
      flex-wrap: nowrap;
      overflow-x: auto;

      &::-webkit-scrollbar {
        height: 10px;
        border-radius: 10px;
        border: 2px solid transparent;
      }

      &::-webkit-scrollbar-track {
        margin: 0 10px;
        border-radius: 8px;
        background-color: rgba($color-white1, 0.2);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-scroll-track-invert);
        border: 2px solid transparent;
        border-radius: 8px;
      }
    }
  }

  &__board-info {
    margin-top: -2px;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    background-color: $color-dark-blue2;

    &-about {
      width: 50%;
      flex-shrink: 2;
    }

    &--additional {
      justify-content: flex-end;
      display: flex;
      gap: 10px;
      align-items: center;
      padding-left: 10px;
    }

    .avatars-wrapper {
      display: flex;
      align-items: center;

      .user-avatar {
        margin-left: -7px;
        &.admin {
          position: relative;

          &::after {
            content: "";
            position: absolute;
            top: -9px;
            left: 50%;
            transform: translateX(-50%);
            display: inline-block;
            width: 12px;
            height: 12px;
            background-image: url(/images/icons/crown.svg);
          }
        }
      }
    }
  }

  @include mobile(max) {
    min-height: auto;

    &__board-info {
      padding-bottom: 5px;

      &--additional {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;

        .avatars-wrapper {
          margin-top: 6px;
          width: 100%;
          order: 2;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
