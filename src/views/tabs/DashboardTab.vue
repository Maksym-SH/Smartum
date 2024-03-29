<template>
  <div class="dashboard-tab">
    <div class="dashboard-tab__content">
      <div
        v-if="!showLockAccess"
        class="dashboard-tab__content--create-new full-width--tablet"
      >
        <ModalCreateNewBoard @create-new="createNewBoard" />
      </div>
      <transition-group
        tag="div"
        class="dashboard-tab__cards"
        mode="out-in"
        name="toggle-content"
      >
        <template v-for="board in dashboardStore.allBoards" :key="board.joinCode">
          <BoardCard
            v-if="board.members"
            :element="board"
            @click="openBoard(board.joinCode)"
          />
        </template>
      </transition-group>
      <transition name="fade">
        <div
          v-show="centeringContent"
          class="dashboard-tab__content--single"
          :class="{ centering: centeringContent }"
        >
          <LockAccess v-if="showLockAccess && !showPreload" />
          <EmptyList v-else-if="listEmpty" :type="EmptyListType.DASHBOARD" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, watch } from "vue";
import { useRouter } from "vue-router";
import { notify } from "@kyvg/vue3-notification";
import { ArrayHasValues } from "@/helpers/methods";

import i18n from "@/i18n";
import newNotificationContent from "@/composables/useNotificationContent";
import useStores from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";

import LockAccess from "@/components/access/NeedEmailConfirmation.vue";
import EmptyList from "@/components/UI/EmptyList.vue";
import ModalCreateNewBoard from "@/components/modals/ModalCreateNewBoard.vue";
import BoardCard from "@/components/board/BoardItem.vue";

import { EmptyListType, NotificationType, Route } from "@/types/enums";
import type { IWorkingBoardItem } from "@/types/interfaces/board";
import type { User } from "@firebase/auth";

export default defineComponent({
  components: {
    LockAccess,
    EmptyList,
    ModalCreateNewBoard,
    BoardCard,
  },
  setup() {
    const { t } = i18n.global;

    const router = useRouter();

    const { notificationStore, dashboardStore, commonStore } = useStores();

    const { unicID, currentUser } = useCurrentUserInfo();

    const showPreload = computed(() => commonStore.loadingStatus);

    const showLockAccess = computed(
      (): boolean => !(currentUser.value as User).emailVerified
    );

    const listEmpty = computed((): boolean => {
      return !ArrayHasValues(dashboardStore.allBoards) && !showPreload.value;
    });

    const centeringContent = computed(
      () => (showLockAccess.value || listEmpty.value) && listEmpty.value
    );

    const createNewBoard = (board: IWorkingBoardItem): void => {
      dashboardStore
        .createNewWorkingBoard(board, unicID.value)
        .then((newBoard: IWorkingBoardItem): void => {
          notify({
            title: t("common.success"),
            text: t("notify.createdBoard.text", { board: newBoard.title }),
            type: "success",
          });

          // Add new notification.
          const notification = newNotificationContent(
            NotificationType.BOARD_CREATED,
            newBoard.title,
            newBoard
          );

          notificationStore.setNewNotification(notification);
        });
    };

    const openBoard = (joinCode: string) => {
      router.push({
        name: Route.BOARD,
        params: {
          code: joinCode,
        },
      });
    };

    // Handler for emptyList boards after confirm email and empty boards.
    watch(
      [dashboardStore.allBoards, () => showLockAccess.value],
      ([boards], [_, oldEmailConfirmValue]) => {
        if (!boards.length || typeof oldEmailConfirmValue !== "boolean") {
          dashboardStore.allBoards = [];
        }
      }
    );

    // Get all boards.
    onBeforeMount((): void => {
      if (!ArrayHasValues(dashboardStore.allBoards)) {
        dashboardStore.getAllWorkingBoards(unicID.value);
      }
    });

    return {
      centeringContent,
      showPreload,
      showLockAccess,
      listEmpty,
      dashboardStore,
      EmptyListType,
      openBoard,
      createNewBoard,
    };
  },
});
</script>

<style lang="scss" scoped>
.dashboard-tab {
  position: relative;
  height: 100%;

  &__content {
    height: 100%;

    &--single {
      height: calc(100% - 85px);

      &.centering {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    &--create-new {
      display: flex;
      justify-content: flex-end;
    }
  }

  &__cards {
    width: 100%;
    padding: 20px 0;
    display: grid;
    grid-template-columns: repeat(5, minmax(280px, 300px));
    gap: 10px;
  }

  @include responsive($custom-large, min) {
    &__cards {
      grid-template-columns: repeat(4, minmax(auto, 25%));
    }
  }

  @include responsive($custom-large, max) {
    &__cards {
      grid-template-columns: repeat(3, minmax(240px, 32.2%));
    }
  }

  @include responsive($xxl, max) {
    &__cards {
      grid-template-columns: repeat(2, 49.4%);
    }
  }

  @include mobile(max) {
    height: 100%;
    padding-bottom: 45px;

    &__container {
      padding-top: 0;
    }

    &__cards {
      grid-template-columns: 1fr;
    }
  }
}
</style>
