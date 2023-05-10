<template>
  <div class="notifications-tab" :class="{ empty: !showList }">
    <div v-if="showList" class="notifications-tab__filters">
      <Button :color="Colors.Info" variant="flat" @click="clearAll">
        Очистить все
      </Button>
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
        @readNotification="notifyAction($event, 'readNotification')"
        @deleteNotification="notifyAction($event, 'deleteNotification')"
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
import { defineComponent, PropType, computed } from "vue";
import { NotifyAction } from "@/types/types";
import { IServerDate, INotification } from "@/types/interfaces";
import { Colors } from "@/types/enums";

import useStores from "@/composables/useStores";
import NotificationItem from "@/components/notification/NotificationItem.vue";
import NotificationEmptyList from "@/components/UI/EmptyList.vue";

export default defineComponent({
  emits: ["readNotification", "deleteNotification", "clearAllNotifications"],
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
  setup(props, { emit }) {
    const { commonStore } = useStores();

    const showList = computed((): boolean => props.notificationList.length > 0);
    const showLoading = computed((): boolean => commonStore.loadingStatus);

    const notifyAction = (id: number, action: NotifyAction): void => {
      const foundNotification = props.notificationList.find(
        (notify) => notify.id === id
      );
      if (foundNotification) {
        emit(action, id); // Delete or read notification by it`s id.
      }
    };

    const clearAll = (): void => {
      emit("clearAllNotifications");
    };

    return {
      clearAll,
      notifyAction,
      showList,
      showLoading,
      Colors,
    };
  },
});
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
    &__filters {
      z-index: 2;
      position: fixed;
      bottom: 10px;
      justify-content: center;
      width: calc(100% - 45px);

      .v-btn {
        width: 100%;
      }
    }
  }
  @include mobile(max) {
    &__filters {
      width: calc(100% - 25px);
    }
  }
}
</style>
