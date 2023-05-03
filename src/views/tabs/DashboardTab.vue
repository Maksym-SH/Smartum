<template>
  <div class="dashboard-tab">
    <div class="dashboard-tab__content">
      <div class="dashboard-tab__content--create-new">
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
      <div 
        v-if="centeringContent"
        class="dashboard-tab__content--single" 
        :class="{'centering': centeringContent }"
      >
        <transition name="toggle-content">
          <LockAccess v-if="showLockAccess"/>
        </transition>
        <EmptyList v-if="showEmptyList" type="dashboard" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { ObjectNotEmpty } from "@/helpers/methods";
import { IWorkingBoardItem } from "@/interfaces";
import { notify } from "@kyvg/vue3-notification";
import { NotificationType } from "@/enums";

import LockAccess from "@/components/dashboard/NeedEmailConfirmation.vue";
import EmptyList from "@/components/ui/EmptyList.vue";
import CreateNewBoard from "@/components/dashboard/modals/CreateNew.vue";
import BoardCard from "@/components/dashboard/BoardItem.vue";
import newNotificationContent from "@/composables/useNotificationContent";

export default defineComponent({ 
  components: {
    LockAccess,
    EmptyList,
    CreateNewBoard,
    BoardCard
  },
  setup() {
    const store = useStore();

    const unicID = computed((): string => store.state.User.currentUser.uid);

    const showLockAccess = computed((): boolean => !store.state.User.currentUser.emailVerified);
    const showEmptyList = computed((): boolean => !ObjectNotEmpty(allBoards) && !showPreload.value)

    const showPreload = computed(() => store.state.loadingStatus);

    const allBoards = reactive<IWorkingBoardItem[]>([])

    const centeringContent = computed(() => (showLockAccess.value || showEmptyList.value) 
                                                                          && !showPreload.value);

    const createNewBoard = (board: IWorkingBoardItem): void => {
      store.dispatch("createNewWorkingBoard", {
        board: board,
        unicID: unicID.value
      }).then((newBoard: IWorkingBoardItem): void => {
        allBoards.push(newBoard);

        notify({ 
          title: "Успешно!",
          text: `Рабочая доска ${ newBoard.title } была успешно создана!`,
          type: "success"
        })
        
        // Add new notification.
        const notification = newNotificationContent(NotificationType.DashboardCreate, newBoard.title);
        store.commit("setNewNotification", notification);
      })
    }

    // Get all boards.
    onMounted((): void => {
      store.dispatch("getAllWorkingBoards", unicID.value).then((boards: IWorkingBoardItem[]) => {
        allBoards.push(...boards);
      })
    })

    return {
      centeringContent,
      showPreload,
      showLockAccess,
      showEmptyList,
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
  @include mobile(max) {
    &__cards {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>