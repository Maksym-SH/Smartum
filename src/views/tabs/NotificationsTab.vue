<template>
  <div class="notifications-tab" :class="{ empty: !showList }">
    <div v-if="showList" class="notifications-tab__filters full-width--tablet">
      <cButton
        class="notifications-tab__filters--clear"
        :color="Colors.Info"
        variant="flat"
        @click="clearAll"
      >
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
        v-for="notify in allNotifications"
        :key="notify.id"
        :params="notify"
        @read-notification="notifyAction($event, 'readNotification')"
        @delete-notification="notifyAction($event, 'deleteNotification')"
      />
    </transition-group>
    <transition name="fade">
      <EmptyList
        v-show="!showList && !showLoading"
        type="notification"
        class="notifications-tab__empty-list"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import type { NotifyAction } from "@/types/types";
import { Colors } from "@/types/enums";
import { ArrayHasValues, ObjectNotEmpty } from "@/helpers/methods";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useStores from "@/composables/useStores";
import NotificationItem from "@/components/notification/NotificationItem.vue";
import NotificationEmptyList from "@/components/UI/EmptyList.vue";

export default defineComponent({
  components: {
    Notification: NotificationItem,
    EmptyList: NotificationEmptyList,
  },
  props: {},
  setup() {
    const { commonStore, notificationStore } = useStores();

    const { allNotifications } = storeToRefs(notificationStore);

    const { currentUser, unicID } = useCurrentUserInfo();

    const showList = computed((): boolean => {
      return ArrayHasValues(allNotifications.value) && ObjectNotEmpty(currentUser.value);
    });

    const showLoading = computed((): boolean => commonStore.loadingStatus);

    const notifyAction = (id: number, action: NotifyAction): void => {
      notificationStore.notificationAction(id, action); // Delete or read notification by it`s id.
    };

    const clearAll = (): void => {
      notificationStore.clearList();
      notificationStore.updateNotificationList(unicID.value);
    };

    return {
      showList,
      showLoading,
      Colors,
      allNotifications,
      clearAll,
      notifyAction,
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
  }
}
</style>
