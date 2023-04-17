<template>
  <div 
    class="notifications-tab"
    :class="{ 'empty': !showList }" 
  >
    <div 
      class="notifications-tab__container" 
      v-if="showList"
    >
      <div class="notifications-tab__filters">
      </div>
      <Notification 
        v-for="notify in notificationList" 
        :key="notify.id" 
        :params="notify"
        @read="notifyAction($event, 'read')"
        @delete ="notifyAction($event, 'delete')"
      />
    </div>
    <EmptyList 
      v-else-if="!showLoading"
      class="notifications-tab__empty-list" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import NotificationItem from '@/components/notification/NotificationItem.vue';
import NotificationEmptyList from "@/components/notification/NotificationsEmptyList.vue";
import { NotifyAction } from "@/types";
import { INotificationDate, INotificationItem } from '@/interfaces';
import { useStore } from 'vuex';

export default defineComponent({
  emits:["read", "delete"],
  components: {
    Notification: NotificationItem,
    EmptyList: NotificationEmptyList
  },
  props: {
    notificationList: {
      type: Array as PropType<Array<INotificationItem<INotificationDate>>>,
      required: true,
    }
  },
  setup(props, { emit }) {
    const store = useStore();

    const showList = computed((): boolean => props.notificationList.length > 0);

    const notifyAction = (id: number, action: NotifyAction): void => {
      const foundNotification = props.notificationList.find((notify) => notify.id === id);
      if (foundNotification) {
        emit(action, id); // Delete or read notification by it`s id.
      }
    }

    return {
      notifyAction,
      showList,
      showLoading: computed(() => store.getters.getLoadingStatus),
    }
  }
})

</script>

<style lang="scss" scoped>
.notifications-tab {
  padding-right: 20px;
  position: relative;
  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__container {
    padding-top: 20px;
    width: 100%;
    height: 100%;
  }
}
</style>