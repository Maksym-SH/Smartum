<template>
  <div
    class="notification-item"
    :class="{ 'not-read': params.status === NotificationStatus.NOT_READ }"
    @click="readNotification"
  >
    <Avatar
      v-if="image && !failedImageLoad"
      :avatar="image"
      :size="45"
      circle
      no-background
      @failed-load="failedImageLoad = true"
    />
    <div
      v-else
      :style="{ background: image.url }"
      class="notification-item__background-avatar"
    />
    <div class="notification-item__content">
      <div class="notification-item__content-info">
        <h3 class="notification-item__title">
          {{ content.title }}
        </h3>
        <time class="notification-item__date">
          {{ dateSent }}
        </time>
      </div>
      <p class="notification-item__description">
        {{ content.description }}
      </p>
    </div>
    <AppButton
      class="notification-item--close"
      variant="text"
      icon="close-circle"
      @click.stop="deleteNotification"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";

import router from "@/router";
import useStore from "@/composables/useStores";
import useCurrentLanguage from "@/composables/useCurrentLanguage";
import useDateParseToString from "@/composables/useDateParse";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useNotificationText from "@/composables/useNotificationText";
import VerifyEmail from "@/helpers/firebase/firebaseVerifyEmail";

import Avatar from "../user/AppAvatar.vue";
import AppButton from "../UI/AppButton.vue";

import * as enums from "@/types/enums";
import type { PropType } from "vue";
import type { INotificationContent } from "@/types";
import type { IPictureParams } from "@/types/interfaces/user";
import type { INotification } from "@/types/interfaces/components";

export default defineComponent({
  components: {
    Avatar,
    AppButton,
  },
  props: {
    params: {
      type: Object as PropType<INotification>,
      required: true,
    },
  },
  emits: ["deleteNotification", "readNotification"],
  setup(props, { emit }) {
    const { i18nLocale } = useCurrentLanguage();

    const { currentUser, unicID } = useCurrentUserInfo();

    const { dashboardStore } = useStore();

    const image = reactive<IPictureParams>({
      url: props.params.image || "",
    });

    const content = ref<INotificationContent>({
      title: computed(() => ""),
      description: computed(() => ""),
    });

    const deleteNotification = (): void => {
      emit("deleteNotification", props.params.id);
    };

    const failedImageLoad = ref(false);

    const dateSent = computed(() =>
      useDateParseToString(props.params.date, i18nLocale.value)
    );

    const joinBoard = () => {
      if (props.params.joinCode && props.params.uid) {
        const { joinCode, uid } = props.params;

        dashboardStore.joinWorkingBoard({ joinCode, uid }, unicID.value);
      }

      deleteNotification();
    };

    const readNotification = (): void => {
      emit("readNotification", props.params.id);
      // Action by notification type.
      switch (props.params.type) {
        // ToDo: Dashboard page.
        // case NotificationAction.DASHBOARD:
        // router.push({ name: Route.DASHBOARD });
        //  break;
        case enums.NotificationAction.VERIFY:
          VerifyEmail(currentUser.value);
          break;
        case enums.NotificationAction.PROFILE:
          router.push({ name: enums.Route.PROFILE });
          break;
        case enums.NotificationAction.RESET:
          router.push({ name: enums.Route.FORGOT });
          break;
        case enums.NotificationAction.CONFIGURATION:
          router.push({ name: enums.Route.CONFIGURATION });
          break;
        case enums.NotificationAction.INVITE_TO_BOARD:
          joinBoard();
          break;
        case enums.NotificationAction.DEFAULT:
        case enums.NotificationAction.DASHBOARD: // ToDo.

        // ToDo: Users page.
        // case NotificationAction.USER:
        //  ...
        //  break;
      }
    };

    onMounted(() => {
      content.value = useNotificationText(props.params);
    });

    return {
      image,
      content,
      failedImageLoad,
      dateSent,
      NotificationStatus: enums.NotificationStatus,
      deleteNotification,
      readNotification,
    };
  },
});
</script>

<style lang="scss" scoped>
.notification-item {
  position: relative;
  display: flex;
  width: 100%;
  background-color: var(--color-background-notification);
  border: 1px solid var(--color-border-notification);
  border-radius: 4px;
  padding: 10px;
  padding-right: 30px;
  margin-bottom: 10px;
  transition: all 0.2s;
  cursor: pointer;
  color: var(--color-text);

  &.not-read {
    background-color: var(--color-background-notification-new);
  }

  &__background-avatar {
    min-width: 45px;
    height: 45px;
    border-radius: 50%;
  }

  &__content {
    width: 100%;
    margin-left: 10px;

    &-info {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      overflow-x: hidden;
    }
  }

  &__title {
    display: inline;
    word-break: break-word;
    font-size: 15px;
    font-weight: bold;
  }

  &__date {
    font-size: 14px;
    white-space: nowrap;
    margin-left: 10px;
    line-height: 25px;
    color: $color-dark-grey4;
  }

  &__description {
    font-size: 13px;
    line-height: 16px;
    color: var(--color-text);
    opacity: 0.8;
  }

  &--close {
    position: absolute;
    top: 1px;
    right: 1px;
    color: var(--color-text);
    padding: 0;
    height: fit-content;
    font-size: 17px;
    cursor: pointer;
    transition: all 0.1s;

    &:hover {
      color: $color-red-hover !important;
    }
  }

  @include mobile(max) {
    padding: 20px 10px 30px 5px;

    &__title {
      font-size: 14px;
    }

    &__date {
      position: absolute;
      bottom: 5px;
      left: 0;
      font-size: 10px;
    }
  }
}
</style>
