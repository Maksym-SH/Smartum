<template>
  <div class="task-item">
    <div class="task-item__info">
      <h3 class="task-item__info-title">{{ task.title }}</h3>
      <cButton
        class="task-item__info--edit initially-transparent"
        variant="text"
        icon="mdi-brush"
      />
    </div>
    <div class="task-item__members">
      <v-tooltip
        v-if="currenUserInvited"
        text="Вы приглашены в эту карточку"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <span
            v-bind="props"
            class="task-item__members--icon-assign initially-transparent mdi mdi-eye-outline"
          ></span>
        </template>
      </v-tooltip>
      <div class="task-item__members-avatars">
        <Avatar
          v-for="user in task.assignedMembers"
          :key="user.uid"
          :size="30"
          :avatar="user.avatarParams"
          :first-name="user.firstName"
          :last-name="user.lastName"
          circle
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { IWorkingBoardTask } from "@/types/interfaces";

import useUserInfo from "@/composables/useCurrentUserInfo";
import Avatar from "@/components/user/Avatar.vue";

export default defineComponent({
  components: {
    Avatar,
  },
  props: {
    task: {
      type: Object as PropType<IWorkingBoardTask>,
      required: true,
    },
  },
  setup(props) {
    const { getFullName, unicID } = useUserInfo();

    const currenUserInvited = computed((): boolean => {
      const isInvited = props.task.assignedMembers.find(
        (member) => member.uid === unicID.value
      );
      return Boolean(isInvited) || false;
    });

    return {
      currenUserInvited,
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
  &:active {
    cursor: grabbing;
  }
  &:hover {
    filter: brightness(115%);

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
    &-title {
      font-size: 14px;
      color: var(--color-text);
      max-width: 80%;
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
      font-size: 18px;
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
}
</style>
