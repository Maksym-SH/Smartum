<template>
  <div class="dashboard-tab">
    <div class="dashboard-tab__content">
      <div class="dashboard-tab__content--create-new" v-if="!showLockAccess">
        <CreateNewBoard @create-new="createNewBoard" />
      </div>
      <transition-group 
        tag="div" 
        class="dashboard-tab__cards"
        mode="out-in"
        name="toggle-content"
      >
        <BoardCard 
          v-for="board in allBoards" 
          :key="board.joinCode" 
          :element="board" 
        />
      </transition-group>
      <transition name="single-content">
        <div 
          v-show="centeringContent"
          class="dashboard-tab__content--single" 
          :class="{'centering': centeringContent }"
        >
          <LockAccess v-if="showLockAccess && !showPreload" />
          <EmptyList v-else-if="emptyList" type="dashboard" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted, ref } from "vue";
import { IWorkingBoardItem } from "@/interfaces";
import { notify } from "@kyvg/vue3-notification";
import { NotificationType } from "@/enums";
import { User } from "@firebase/auth";

import LockAccess from "@/components/dashboard/NeedEmailConfirmation.vue";
import EmptyList from "@/components/UI/EmptyList.vue";
import CreateNewBoard from "@/components/dashboard/modals/CreateNew.vue";
import BoardCard from "@/components/dashboard/BoardItem.vue";
import newNotificationContent from "@/composables/useNotificationContent";
import useStores from "@/composables/useStores";

export default defineComponent({ 
  components: {
    LockAccess,
    EmptyList,
    CreateNewBoard,
    BoardCard
  },
  setup() {
    const { notificationStore, dashboardStore, userStore, commonStore } = useStores();

    const unicID = computed((): string => (userStore.currentUser as User).uid);

    const showPreload = computed(() => commonStore.loadingStatus);

    const allBoards = reactive<IWorkingBoardItem[]>([])

    const showLockAccess = computed((): boolean => !(userStore.currentUser as User).emailVerified);
    const emptyList = ref(false);

    const centeringContent = computed(() => (showLockAccess.value || emptyList.value) 
                                                                          && !showPreload.value);

    const createNewBoard = (board: IWorkingBoardItem): void => {
      dashboardStore.createNewWorkingBoard(board, unicID.value)
      .then((newBoard: IWorkingBoardItem): void => {
        allBoards.push(newBoard);

        notify({ 
          title: "Успешно!",
          text: `Рабочая доска ${ newBoard.title } была успешно создана!`,
          type: "success"
        })

        emptyList.value = false;

        // Add new notification.
        const notification = newNotificationContent(NotificationType.DashboardCreate, newBoard.title);

        notificationStore.setNewNotification(notification);
      })
    }

    // Get all boards.
    onMounted((): void => {
      dashboardStore.getAllWorkingBoards(unicID.value)
      .then((boards: IWorkingBoardItem[]) => {
        const noBoards = boards.length === 0;

        if (noBoards) {
          emptyList.value = true;
        }
        else {
          allBoards.push(...boards);
        }
      })
    })

    return {
      centeringContent,
      showPreload,
      showLockAccess,
      emptyList,
      allBoards,
      createNewBoard
    }
  }
})

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
    grid-template-columns: repeat(5, minmax(240px, 300px));
    gap: 15px;
  }
  @include responsive($custom-large, min) {
    &__cards {
      grid-template-columns: repeat(5, minmax(auto, 20%));
    }
  }
  @include responsive($custom-large, max) {
    &__cards {
      grid-template-columns: repeat(4, minmax(240px, 25%));
    }
  }
  @include responsive($xxl, max) {
    &__cards {
      grid-template-columns: repeat(3, 32.2%);
    }
  }
  @include responsive(1100px, max) {
    &__cards {
      grid-template-columns: repeat(2, 49%);
    }
  }
  @include tablet(max) {
    &__cards {
      grid-template-columns: 1fr;
    }
  }
  @include tablet(max) {
    height: 100%;
    padding-bottom: 45px;
    &__container {
      padding-top: 0;
    }
    &__content--create-new {
      z-index: 3;
      position: fixed;
      bottom: 10px;
      justify-content: center;
      width: calc(100% - 45px);

      :deep(.v-btn) {
        width: 100% !important;
      }
    }
  }
  @include mobile(max) {
    &__content--create-new {
      width: calc(100% - 20px);
    }
  }
}
</style>