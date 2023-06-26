<template>
  <div class="task-item">
    <div class="task-item__info">
      <div class="task-item__info-main">
        <div class="task-item__info-marks" v-if="task.marks">
          <BackgroundItem
            v-for="mark in task.marks"
            :height="7"
            :width="25"
            :key="mark"
            :background="mark"
          />
        </div>
        <h3 class="task-item__info-title">{{ task.title }}</h3>
      </div>
      <span class="task-item__info-actions">
        <AppButton
          @click="taskModalActive = true"
          class="task-item__info--edit initially-transparent"
          variant="text"
          icon="information-outline"
        />
        <span v-if="subtasksCount" class="task-item__info-subtasks">
          <InlineSvg src="/images/icons/task.svg" />
          {{ subtasksCount }}
        </span>
      </span>
    </div>
    <div class="task-item__members">
      <v-tooltip
        v-if="currenUserInvited"
        text="Вы назначены на эту карточку"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <InlineSvg
            v-bind="props"
            src="/images/icons/eye-outline.svg"
            class="task-item__members--icon-assign initially-transparent"
          />
        </template>
      </v-tooltip>
      <transition-group
        tag="div"
        class="task-item__members-avatars"
        name="toggle-content"
      >
        <template v-for="user in task.assignedMembers" :key="user.uid">
          <Avatar
            v-if="memebersIds.includes(user.uid)"
            :size="30"
            :avatar="user.avatarParams"
            :first-name="user.firstName"
            :last-name="user.lastName"
            circle
          />
        </template>
      </transition-group>
    </div>
    <Teleport to="body">
      <transition name="toggle-content" mode="out-in">
        <TaskInfoModal
          v-if="taskModalActive"
          :task-id="task.id"
          :column-id="columnId"
          v-model:taskModalActive="taskModalActive"
        />
      </transition>
    </Teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref } from "vue";
import { IWorkingBoardTask } from "@/types/interfaces";

import useUserInfo from "@/composables/useCurrentUserInfo";
import useBoardMembersInfo from "@/composables/useBoardMembersInfo";
import Avatar from "@/components/user/AppAvatar.vue";
import TaskInfoModal from "@/components/modals/ModalInfoTask.vue";
import InlineSvg from "vue-inline-svg";
import BackgroundItem from "@/components/UI/BackgroundItem.vue";

export default defineComponent({
  components: {
    Avatar,
    InlineSvg,
    TaskInfoModal,
    BackgroundItem,
  },
  props: {
    task: {
      type: Object as PropType<IWorkingBoardTask>,
      required: true,
    },
    columnId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { getFullName, unicID } = useUserInfo();

    const { memebersIds } = useBoardMembersInfo();

    const taskModalActive = ref(false);

    const currenUserInvited = computed((): boolean => {
      if (props.task.assignedMembers) {
        const isInvited = props.task.assignedMembers.find(
          (member) => member.uid === unicID.value
        );
        return Boolean(isInvited);
      }

      return false;
    });

    const subtasksCount = computed((): string | false => {
      if (props.task.subtasks && props.task.subtasks.length) {
        const completedCount = props.task.subtasks.filter(
          (subtask) => subtask.done
        ).length;
        const substasksCount = props.task.subtasks.length;

        return `${completedCount} / ${substasksCount}`;
      }

      return false;
    });

    return {
      taskModalActive,
      currenUserInvited,
      subtasksCount,
      memebersIds,
      getFullName,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-item {
  width: 100%;
  padding: 5px;
  border-radius: 4px;
  background-color: var(--color-background-task);
  box-shadow: 0 0 5px rgba($color-black, 0.1);
  cursor: grab;
  transition: background-color 0.3s;

  &:active {
    cursor: grabbing;
  }

  &:hover {
    background-color: var(--color-hover-background-task-card);

    .initially-transparent {
      opacity: 1;
    }
  }

  .initially-transparent {
    transition: all 0.5s ease;
    opacity: 0;
  }

  &__info {
    display: flex;
    justify-content: space-between;

    &-actions {
      display: inline-flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 5px;
    }

    &-subtasks {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: var(--color-text);
      font-size: 10px;

      svg {
        width: 12px;
      }
    }

    &-marks {
      display: flex;
      gap: 5px;

      .image-example {
        cursor: inherit;
      }
    }

    &-main {
      max-width: 80%;
    }

    &-title {
      font-size: 14px;
      color: var(--color-text);
      word-break: break-word;
    }

    &--edit {
      padding: 5px;
      height: fit-content;
      font-size: 15px;
      color: var(--color-text) !important;
    }
  }

  &__members {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;

    &--icon-assign {
      width: 25px;
      color: var(--color-text);
    }

    &-avatars {
      display: flex;
      flex-grow: 2;
      justify-content: flex-end;

      .user-avatar {
        margin-left: -7px;
      }
    }
  }
  @include tablet(max) {
    .initially-transparent {
      opacity: 1;
    }
  }
}
</style>
