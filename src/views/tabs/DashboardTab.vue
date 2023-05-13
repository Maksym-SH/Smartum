<template>
  <div class="dashboard-tab">
    <div class="dashboard-tab__content">
      <div v-if="!showLockAccess" class="dashboard-tab__content--create-new full-width--tablet">
        <CreateNewBoard @create-new="createNewBoard" />
      </div>
      <transition-group
        tag="div"
        class="dashboard-tab__cards"
        mode="out-in"
        name="toggle-content"
      >
        <BoardCard
          v-for="board in dashboardStore.allDashboards"
          :key="board.joinCode"
          :element="board"
        />
      </transition-group>
      <transition name="single-content">
        <div
          v-show="centeringContent"
          class="dashboard-tab__content--single"
          :class="{ centering: centeringContent }"
        >
          <LockAccess v-if="showLockAccess && !showPreload" />
          <EmptyList v-else-if="listEmpty" type="dashboard" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import type { User } from '@firebase/auth'
import type { IWorkingBoardItem } from '@/types/interfaces'
import { NotificationType } from '@/types/enums'

import LockAccess from '@/components/dashboard/NeedEmailConfirmation.vue'
import EmptyList from '@/components/UI/EmptyList.vue'
import CreateNewBoard from '@/components/dialogs/CreateNewBoard.vue'
import BoardCard from '@/components/dashboard/BoardItem.vue'
import newNotificationContent from '@/composables/useNotificationContent'
import useStores from '@/composables/useStores'
import useCurrentUserInfo from '@/composables/useCurrentUserInfo'

export default defineComponent({
  components: {
    LockAccess,
    EmptyList,
    CreateNewBoard,
    BoardCard,
  },
  setup() {
    const router = useRouter()

    const { notificationStore, dashboardStore, commonStore } = useStores()

    const { unicID, currentUser } = useCurrentUserInfo()

    const showPreload = computed(() => commonStore.loadingStatus)

    const showLockAccess = computed(
      (): boolean => !(currentUser.value as User).emailVerified,
    )

    const listEmpty = ref(false)

    const centeringContent = computed(
      () => (showLockAccess.value || listEmpty.value) && !showPreload.value,
    )

    const createNewBoard = (board: IWorkingBoardItem): void => {
      dashboardStore
        .createNewWorkingBoard(board, unicID.value)
        .then((newBoard: IWorkingBoardItem): void => {
          notify({
            title: 'Успешно!',
            text: `Рабочая доска ${newBoard.title} была успешно создана!`,
            type: 'success',
          })

          listEmpty.value = false

          // Add new notification.
          const notification = newNotificationContent(
            NotificationType.DashboardCreate,
            newBoard.title,
          )

          notificationStore.setNewNotification(notification)
        })
    }

    const openBoard = (joinCode: string) => {
      router.push({
        name: 'Board',
        params: {
          code: joinCode,
        },
      })
    }

    // Get all boards.
    onBeforeMount((): void => {
      if (!dashboardStore.allDashboards.length) {
        dashboardStore.getAllWorkingBoards(unicID.value)
          .then(() => {
            if (!dashboardStore.allDashboards.length) // Still no boards.
              listEmpty.value = true
          })
      }
    })

    return {
      centeringContent,
      showPreload,
      showLockAccess,
      listEmpty,
      dashboardStore,
      openBoard,
      createNewBoard,
    }
  },
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
  }
}
</style>
