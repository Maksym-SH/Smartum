<template>
  <div class="notifications">
    <cButton
      @click="toggleNotificationsWindow"
      icon="mdi-bell-outline"
      class="notifications__btn"
      variant="text"
    >
      <v-badge
        v-show="notificationsSize"
        class="notifications__badge"
        :content="notificationsSize"
      />
    </cButton>
    <DropdownWindow
      :visible="showNotificationsWindow"
      class="notifications__window"
      :width="440"
      :height="355"
      :centering="!filteredList.length"
      @hideDropdown="showNotificationsWindow = false"
    >
      <template #header>
        <div class="notifications__window-header">
          <h2 class="notifications__window-title">Уведомления</h2>
          <nav class="notifications__window--actions">
            <cCheckbox
              v-model="onlyUnread"
              :disabled="!notificationsSize"
              switch-box
              name="changeWatchType"
              label="Только непрочитанные"
            ></cCheckbox>
            <cButton
              @click="showNotificationsWindow = false"
              variant="text"
              class="notifications__window--close"
              icon="mdi-close"
            />
          </nav>
        </div>
      </template>
      <template #content>
        <div class="notifications__window-items">
          <NotificationItem
            v-for="notification in filteredList"
            :key="notification.id"
            :params="notification"
            @read-notification="notifyAction($event, 'readNotification')"
            @delete-notification="notifyAction($event, 'deleteNotification')"
          />
          <EmptyList v-show="!filteredList.length" type="notification" />
        </div>
      </template>
    </DropdownWindow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import type { NotifyAction } from "@/types/types";

import useNotifications from "@/composables/useNotifications";
import useStore from "@/composables/useStores";
import NotificationItem from "./NotificationItem.vue";
import DropdownWindow from "@/container/DropdownWindow.vue";
import EmptyList from "../UI/EmptyList.vue";

export default defineComponent({
  components: {
    NotificationItem,
    DropdownWindow,
    EmptyList,
  },
  emits: ["windowOpened"],
  props: {
    closePanel: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { notificationStore } = useStore();

    const showNotificationsWindow = ref(false);

    const { notificationsSize, allNotifications } = useNotifications();

    const toggleNotificationsWindow = (): void => {
      showNotificationsWindow.value = !showNotificationsWindow.value;
    };

    const notifyAction = (id: number, action: NotifyAction): void => {
      notificationStore.notificationAction(id, action); // Delete or read notification by it`s id.
    };

    // Filter by unread.
    const onlyUnread = ref(false);

    const unreadNotifications = computed(() =>
      allNotifications.value.filter((notification) => notification.status === "not read")
    );

    const filteredList = computed(() => {
      if (onlyUnread.value) {
        return unreadNotifications.value;
      }
      return allNotifications.value;
    });

    return {
      onlyUnread,
      filteredList,
      notificationsSize,
      showNotificationsWindow,
      notifyAction,
      toggleNotificationsWindow,
    };
  },
});
</script>

<style lang="scss" scoped>
.notifications {
  position: relative;
  &__btn {
    font-size: 20px;
    padding: 0 5px;
  }
  &__badge {
    position: absolute;
    right: 7px;
    z-index: 2;
    top: -2px;
    display: inline-flex;
    :deep(.v-badge__badge) {
      background-color: $color-red;
    }
  }
  &__window {
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
    &-title {
      padding-left: 10px;
      color: var(--color-text);
      font-size: 20px;
    }
    &--actions {
      display: flex;
      align-items: center;
      gap: 10px;
      :deep(.main-label) {
        font-size: 12px;
      }
    }
    &--close {
      color: var(--color-text) !important;
      font-size: 25px;
      padding: 0 5px;
    }
    &-items {
      .notification-item {
        padding-bottom: 25px;
        :deep(.notification-item__content) {
          .notification-item__date {
            font-size: 12px;
            position: absolute;
            bottom: 0;
            left: 0;
          }
        }
      }
    }
  }
  @include mobile(max) {
    &__window {
      &-header {
        height: 100%;
      }
      &-title {
        padding-left: 5px;
        font-size: 14px;
      }
      &--actions {
        gap: 5px;
      }
    }
  }
}
</style>
