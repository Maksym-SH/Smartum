<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" @board-leave="boardLeave" />
    <div class="board-item-page__content" :style="{ background: boardBackground }">
      <cLoader v-if="!showedCommonLoader && !boardNotEmpty" />
      <transition name="toggle-content">
        <div v-if="boardNotEmpty" class="board-item-page__board-info">
          <div class="board-item-page__board-info-about">
            <h3 class="board-item-page__name">
              {{ boardItem.title }}
            </h3>
            <p class="board-item-page__members-count">
              Участников доски: {{ membersCount }}
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
                    :class="{ admin: item.role === 'Администратор' }"
                    v-bind="props"
                    circle
                  />
                </template>
              </v-tooltip>
            </div>
            <BtnInviteUsers :board="boardItem" @invited="setInviteUserToBoard" />
          </div>
        </div>
      </transition>
      <div class="board-item-page__content-tasks">
        <Column
          v-for="column in boardItem.tasks"
          :key="column.id"
          :column="column"
          v-model:column-title="column.title"
          v-model:column-tasks="column.tasks"
        />
        <AddColumn :column-length="columnLength" @createColumn="createColumn" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type {
  IUserForList,
  IWorkingBoardItem,
  IWorkingBoardMember,
  IWorkingBoardTaskColumn,
} from "@/types/interfaces";
import { ObjectNotEmpty, OpenPopup } from "@/helpers/methods";
import { Colors } from "@/types/enums";
import { notify } from "@kyvg/vue3-notification";

import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import BoardHeader from "@/components/dashboard/BoardPageHeader.vue";
import BtnInviteUsers from "@/components/user/InviteBtn.vue";
import Avatar from "@/components/user/Avatar.vue";
import Column from "@/components/dashboard/task/Column.vue";
import AddColumn from "@/components/dashboard/task/AddNewColumn.vue";

export default defineComponent({
  components: {
    BoardHeader,
    Avatar,
    BtnInviteUsers,
    Column,
    AddColumn,
  },
  setup() {
    const router = useRouter();

    const { commonStore, dashboardStore } = useStore();

    const showedCommonLoader = computed((): boolean => {
      return commonStore.loadingStatus;
    });

    const { unicID, userInfo, getFullName } = useCurrentUserInfo();

    const boardItem = ref<IWorkingBoardItem>({} as IWorkingBoardItem);

    const boardMembers = ref<IUserForList[]>([]);

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
          title: "Выйти из рабочего пространства?",
          text: leaveMessage(currentMember),
          buttons: {
            yes: {
              text: "Покинуть",
              color: Colors.Danger,
            },
          },
          callback: (): void => {
            dashboardStore.leaveWorkingBoard(currentMember, boardItem.value).then(() =>
              notify({
                title: "Вы успешно покинули рабочее пространство!",
                text: "Пространство было удалено из вашего списка рабочих досок.",
                type: "success",
              })
            );
          },
        });
      }
    };

    const leaveMessage = (currentMember: IWorkingBoardMember): string => {
      if (
        // Is Admin and members more than 1.
        currentMember.uid === boardItem.value.uid &&
        boardItem.value.members.length > 1
      ) {
        return "Вы являетесь администратором доски, если вы покинете рабочую доску, администратором станет первый приглашенный вами пользователь. Продолжить?";
      } else {
        // Is member.
        return "Вы можете снова присоединиться к доске если вам отправит приглашение один её участников.";
      }
    };

    // Tasks
    const createColumn = (column: IWorkingBoardTaskColumn): void => {
      boardItem.value.tasks.push(column);
    };

    const columnLength = computed((): number => {
      return boardItem.value.tasks?.length || 0;
    });

    onMounted((): void => {
      const joinCode = router.currentRoute.value.params.code as string;

      dashboardStore
        .getWorkingBoardItem(unicID.value, joinCode)
        .then((info) => {
          boardItem.value = info.value;
          boardMembers.value = info.members;
        })
        .catch(() => {
          router.push({ name: "Dashboard" });
        });
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
      setInviteUserToBoard,
      createColumn,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-item-page {
  height: 100%;
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
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    background-color: rgba($color-grey, 0.75);
    box-shadow: 0 10px 15px rgba($color-grey, 0.8);
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
        margin-left: -10px;
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
  @include tablet(max) {
    &__board-info {
      &--additional {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .avatars-wrapper {
          width: 100%;
          order: 2;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
