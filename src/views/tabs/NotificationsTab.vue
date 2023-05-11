<template>
  <div class="notifications-tab" :class="{ empty: !showList }">
    <div v-if="showList" class="notifications-tab__filters full-width--tablet">
      <cButton :color="Colors.Info" variant="flat" @click="clearAll">
        Очистить все
      </cButton>
    </div>
    <transition-group
      v-if="showList"
      class="notifications-tab__container"
      tag="div"
      name="toggle-content"
      mode="in-out"
    >
      <Notification
        v-for="notify in notificationList"
        :key="notify.id"
        :params="notify"
        @read-notification="notifyAction($event, 'readNotification')"
        @delete-notification="notifyAction($event, 'deleteNotification')"
      />
    </transition-group>
    <transition name="single-content">
      <EmptyList
        v-show="!showList && !showLoading"
        type="notification"
        class="notifications-tab__empty-list"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import type { NotifyAction } from '@/types/types'
import type { INotification, IServerDate } from '@/types/interfaces'
import { Colors } from '@/types/enums'
import useCurrentUserInfo from '@/composables/useCurrentUserInfo'

import useStores from '@/composables/useStores'
import NotificationItem from '@/components/notification/NotificationItem.vue'
import NotificationEmptyList from '@/components/UI/EmptyList.vue'
import { ObjectNotEmpty } from '@/helpers/methods'

export default defineComponent({
  components: {
    Notification: NotificationItem,
    EmptyList: NotificationEmptyList,
  },
  props: {
    notificationList: {
      type: Array as PropType<INotification<IServerDate>[]>,
      required: true,
    },
  },
  emits: ['readNotification', 'deleteNotification', 'clearAllNotifications'],
  setup(props, { emit }) {
    const { commonStore } = useStores()

    const { currentUser } = useCurrentUserInfo()

    const showList = computed((): boolean => {
      return props.notificationList.length > 0 && ObjectNotEmpty(currentUser.value)
    })
    const showLoading = computed((): boolean => commonStore.loadingStatus)

    const notifyAction = (id: number, action: NotifyAction): void => {
      const foundNotification = props.notificationList.find(
        notify => notify.id === id,
      )
      if (foundNotification)
        emit(action, id) // Delete or read notification by it`s id.
    }

    const clearAll = (): void => {
      emit('clearAllNotifications')
    }

    return {
      clearAll,
      notifyAction,
      showList,
      showLoading,
      Colors,
    }
  },
})
</script>

<style lang="scss" scoped>
.notifications-tab {
  position: relative;
  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  &__container {
    padding-top: 20px;
    width: 100%;
    height: 100%;
  }
  &__filters {
    display: flex;
    justify-content: flex-end;
    color: $color-white1;
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
