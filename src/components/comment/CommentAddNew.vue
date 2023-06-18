<template>
  <div class="new-comment">
    <span class="new-comment-title">
      <Avatar
        v-if="showAvatar"
        class="avatar"
        :avatar="member.avatarParams"
        circle
        :size="23"
        :first-name="member.firstName"
        :last-name="member.lastName"
      />
      Оставить комментарий
    </span>
    <form class="new-comment__textarea-inner" @submit.prevent="createComment">
      <AppTextarea
        v-model.trim="newCommentMessage"
        :max="Length.Textarea"
        :min="newCommentMessage ? Length.Text : Length.None"
        name="taskDescription"
        placeholder="Напишите комментарий"
      />
      <AppButton
        :disabled="!newCommentMessage"
        size="small"
        title="Отправить"
        type="submit"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import { Length } from "@/types/enums";
import type { ITaskComment, IUserForList } from "@/types/interfaces";

import Avatar from "../user/AppAvatar.vue";

export default defineComponent({
  props: {
    member: {
      type: Object as PropType<IUserForList>,
      required: true,
    },
    commentsSize: {
      type: Number,
      required: true,
    },
    showAvatar: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Avatar,
  },
  emits: ["createComment", "update"],
  setup(props, { emit }) {
    const newCommentMessage = ref("");

    const createComment = (): void => {
      if (newCommentMessage.value.length < Length.Text) return;

      const newId = props.commentsSize;

      const commentData: Partial<ITaskComment> = {
        id: newId,
        dateOfCreate: new Date(),
        member: props.member,
        message: newCommentMessage.value,
        edited: false,
      };

      emit("createComment", commentData);

      newCommentMessage.value = "";
    };

    return {
      Length,
      newCommentMessage,
      createComment,
    };
  },
});
</script>

<style lang="scss" scoped>
.new-comment {
  padding-left: 25px;

  &-title {
    position: relative;
    font-size: 14px;
    font-style: italic;
    color: var(--color-text);

    .avatar {
      position: absolute;
      left: -25px;
    }
  }

  &__textarea-inner {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .c-textarea {
      height: 76px;
      font-size: 16px;
      padding: 0;
    }

    .c-button {
      width: fit-content;
      text-transform: none;
      color: $color-white1 !important;
      align-self: flex-end;
    }
  }

  @include responsive($us, max) {
    padding-left: 0;

    &-title {
      .avatar {
        display: none;
      }
    }
  }
}
</style>
