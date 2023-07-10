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
      {{ $t("common.comments.new") }}
    </span>
    <form class="new-comment__textarea-inner" @submit.prevent="createComment">
      <AppTextarea
        v-model.trim="newCommentMessage"
        :max="Length.TEXTAREA"
        :min="newCommentMessage ? Length.TEXT : Length.NONE"
        @keydown.enter.exact.prevent="createComment"
        name="taskDescription"
        :placeholder="$t('labels.newComment')"
      />
      <AppButton
        :disabled="!newCommentMessage"
        size="small"
        :title="$t('buttons.send')"
        type="submit"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Avatar from "../user/AppAvatar.vue";

import type { PropType } from "vue";
import { Length } from "@/types/enums";
import type { ITaskComment } from "@/types/interfaces/board";
import type { IUserForList } from "@/types/interfaces/user";

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
      if (newCommentMessage.value.length < Length.TEXT) return;

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
  padding-left: 20px;

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
      width: 95px;
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
