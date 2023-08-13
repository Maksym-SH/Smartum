<template>
  <div class="notifications">
    <AppButton
      icon="bell-outline"
      class="notifications__btn"
      variant="text"
      :class="{ active: showedNotificationsWindow }"
      @click="toggleNotificationsWindow"
    >
      <VBadge
        v-show="notificationsSize"
        class="notifications__badge"
        :content="notificationsSize"
      />
    </AppButton>
    <DropdownWindow
      :visible="showedNotificationsWindow"
      class="notifications__window"
      :width="440"
      :height="355"
      :centering="!filteredList.length"
      @hide-dropdown="showedNotificationsWindow = false"
    >
      <template #header>
        <div class="notifications__window-header">
          <h2 class="notifications__window-title">
            {{ $t("dropdown.notifications") }}
          </h2>
          <nav class="notifications__window--actions">
            <AppCheckbox
              v-model="onlyUnread"
              :disabled="!notificationsSize"
              switch-box
              name="changeWatchType"
              :label="$t('dropdown.notificationFilter')"
            />
            <AppButton
              variant="text"
              class="notifications__window--close"
              icon="close"
              @click="showedNotificationsWindow = false"
            />
          </nav>
        </div>
      </template>
      <template #content>
        <transition-group
          tag="div"
          name="notification-fade"
          mode="out-in"
          class="notifications__window-items"
        >
          <NotificationItem
            v-for="notification in filteredList"
            :key="notification.id"
            :params="notification"
            @read-notification="notifyAction($event, 'readNotification')"
            @delete-notification="notifyAction($event, 'deleteNotification')"
          />
          <EmptyList
            v-show="!filteredList.length"
            key="empty-list"
            :type="EmptyListType.NOTIFICATIONS"
          />
        </transition-group>
      </template>
    </DropdownWindow>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import useStore from "@/composables/useStores";
import useNotifications from "@/composables/useNotifications";

import AppButton from "../UI/AppButton.vue";
import AppCheckbox from "../UI/AppCheckbox.vue";
import DropdownWindow from "../container/DropdownWindow.vue";
import EmptyList from "../UI/EmptyList.vue";
import NotificationItem from "./NotificationItem.vue";
import { VBadge } from "vuetify/components";

import type { NotifyAction } from "@/types";
import { EmptyListType, NotificationStatus } from "@/types/enums";

export default defineComponent({
  components: {
    AppButton,
    AppCheckbox,
    NotificationItem,
    DropdownWindow,
    EmptyList,
    VBadge,
  },
  props: {
    closePanel: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["windowOpened"],
  setup() {
    const { notificationStore } = useStore();

    const showedNotificationsWindow = ref(false);

    const { notificationsSize, allNotifications } = useNotifications();

    const toggleNotificationsWindow = (): void => {
      showedNotificationsWindow.value = !showedNotificationsWindow.value;
    };

    const notifyAction = (id: number, action: NotifyAction): void => {
      notificationStore.notificationAction(id, action); // Delete or read notification by it`s id.
    };

    // Filter by unread.
    const onlyUnread = ref(false);

    const unreadNotifications = computed(() =>
      allNotifications.value.filter(
        (notification) => notification.status === NotificationStatus.NOT_READ
      )
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
      showedNotificationsWindow,
      EmptyListType,
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

    &.active {
      pointer-events: none;
      background-color: rgba($color-blue, 0.4);
    }
  }

  &__badge {
    position: absolute;
    right: 7px;
    z-index: 2;
    top: -2px;
    display: inline-flex;

    :deep(.v-badge__badge) {
      background-color: $color-red;
      height: 15px;
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

.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.4s ease-in;
  max-height: 400px;
}
.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scale(0.8);
}
</style>
