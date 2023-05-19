<template>
  <div
    class="notification-item"
    :class="{ 'not-read': params.status === 'not read' }"
    @click="readNotification"
  >
    <Avatar
      v-if="image && !failedImageLoad"
      @failed-load="failedImageLoad = true"
      :avatar="image"
      :size="45"
      circle
      no-background
    />
    <div
      v-else
      :style="{ background: image.url }"
      class="notification-item__background-avatar"
    ></div>
    <div class="notification-item__content">
      <div class="notification-item__content-info">
        <h3 class="notification-item__title">
          {{ params.title }}
        </h3>
        <time class="notification-item__date">
          {{ dateSent }}
        </time>
      </div>
      <p class="notification-item__description">
        {{ params.description }}
      </p>
    </div>
    <cButton
      class="notification-item__close"
      variant="text"
      icon="mdi-close-circle"
      @click.stop="deleteNotification"
    />
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent, reactive, ref } from "vue";
import type {
  INotification,
  IPictureParams,
  IServerDate,
  IUserForList,
} from "@/types/interfaces";
import { NotificationActionType } from "@/types/enums";
import { notify } from "@kyvg/vue3-notification";

import VerifyEmail from "@/helpers/firebase/firebaseVerifyEmail";
import router from "@/router";
import useStore from "@/composables/useStores";
import useDateParseToString from "@/composables/useDateParse";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import Avatar from "../user/Avatar.vue";

export default defineComponent({
  components: {
    Avatar,
  },
  props: {
    params: {
      type: Object as PropType<INotification<IServerDate | Date>>,
      required: true,
    },
  },
  emits: ["deleteNotification", "readNotification"],
  setup(props, { emit }) {
    const { currentUser, userInfo } = useCurrentUserInfo();

    const { dashboardStore } = useStore();

    const image = reactive<IPictureParams>({
      url: props.params.image || "",
    });

    const deleteNotification = (): void => {
      emit("deleteNotification", props.params.id);
    };

    const failedImageLoad = ref(false);

    const dateSent = useDateParseToString(props.params.date);

    const readNotification = (): void => {
      emit("readNotification", props.params.id);
      // Action by notification type.
      switch (props.params.type) {
        // ToDo: Dashboard page.
        // case NotificationActionType.Dashboard:
        //  router.push({ name: "Dashboard" });
        //  break;
        case NotificationActionType.Verify:
          VerifyEmail(currentUser.value);
          break;
        case NotificationActionType.Profile:
          router.push({ name: "Profile" });
          break;
        case NotificationActionType.Reset:
          router.push({ name: "Forgot" });
          break;
        case NotificationActionType.Configuration:
          router.push({ name: "Configuration" });
          break;
        case NotificationActionType.InviteToBoard: {
          const boardInfo = props.params as Required<INotification<IServerDate>>;

          dashboardStore
            .getWorkingBoardItem(boardInfo.uid, boardInfo.joinCode)
            .then((board) => {
              const newMember: Partial<IUserForList> = {
                ...userInfo.value,
                role: "Участник",
                uid: currentUser.value.uid,
              };
              // Update data for other users.
              dashboardStore.getAllWorkingBoards(board.uid).then((list) => {
                const boardToUpdate = list.find(
                  (board) => board.uid === props.params.uid
                );

                boardToUpdate?.members.push(newMember);

                dashboardStore.updateAllWorkingBoards(board.uid, list);
              });

              // Add a new invite board
              board.members.push(newMember);
              dashboardStore
                .createNewWorkingBoard(board, currentUser.value.uid)
                .then(() => {
                  notify({
                    title: "Успешно!",
                    text: "Вы успешно присоединились к рабочему пространству!",
                  });
                });
            });

          deleteNotification();
          break;
        }
        case NotificationActionType.Default:
        case NotificationActionType.Dashboard: // ToDo.

        // ToDo: Users page.
        // case NotificationActionType.User:
        //  router.push({ name: "Dashboard/User" })
        //  break;
      }
    };

    return {
      deleteNotification,
      readNotification,
      image,
      failedImageLoad,
      dateSent,
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
  }
  &__date {
    font-size: 14px;
    white-space: nowrap;
    margin-left: 10px;
    line-height: 22px;
    color: $color-dark-grey4;
  }
  &__description {
    margin-top: 7px;
    font-size: 13px;
    line-height: 16px;
    color: var(--color-text);
    opacity: 0.8;
  }
  &__close {
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
