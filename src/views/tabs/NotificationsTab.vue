<template>
  <div 
    class="notifications-tab"
    :class="{ 'empty': !showList }" 
  >
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
        @readNotification="notifyAction($event, 'readNotification')"
        @deleteNotification ="notifyAction($event, 'deleteNotification')"
      />
    </transition-group>
    <EmptyList 
      v-else-if="!showLoading"
      type="notification"
      class="notifications-tab__empty-list" 
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { NotifyAction } from "@/types";
import { IServerDate, INotificationItem } from '@/interfaces';
import { useStore } from 'vuex';

import NotificationItem from '@/components/notification/NotificationItem.vue';
import NotificationEmptyList from "@/components/UI/EmptyList.vue";

export default defineComponent({
  emits:["readNotification", "deleteNotification"],
  components: {
    Notification: NotificationItem,
    EmptyList: NotificationEmptyList
  },
  props: {
    notificationList: {
      type: Array as PropType<INotificationItem<IServerDate>[]>,
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
      showLoading: computed(() => store.state.loadingStatus),
    }
  }
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
}
</style>