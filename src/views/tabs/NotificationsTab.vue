<template>
  <div class="notifications-tab" :class="{ empty: !showList }">
    <div v-if="showList" class="notifications-tab__filters full-width--tablet">
      <AppButton
        class="notifications-tab__filters--clear"
        :color="Colors.INFO"
        variant="flat"
        :title="$t('buttons.clearAll')"
        @click="clearAll"
      />
    </div>
    <transition-group
      v-if="showList"
      class="notifications-tab__container"
      tag="div"
      name="smooth-height"
      mode="out-in"
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
        :type="EmptyListType.NOTIFICATIONS"
        class="notifications-tab__empty-list"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { ArrayHasValues, ObjectNotEmpty } from "@/helpers/methods";

import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useStores from "@/composables/useStores";

import AppButton from "@/components/UI/AppButton.vue";
import Notification from "@/components/notification/NotificationItem.vue";
import EmptyList from "@/components/UI/EmptyList.vue";

import type { NotifyAction } from "@/types";
import { Colors, EmptyListType } from "@/types/enums";

export default defineComponent({
  components: {
    AppButton,
    Notification,
    EmptyList,
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
      EmptyListType,
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

    &--clear {
      color: $color-white1;
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
