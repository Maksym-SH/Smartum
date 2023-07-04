<template>
  <div class="comment">
    <div class="comment__info">
      <Avatar
        :avatar="member.avatarParams"
        circle
        class="avatar"
        :size="23"
        :first-name="member.firstName"
        :last-name="member.lastName"
      />
      <span class="comment__info-title">
        {{ getFullName(member) }}
        <span class="comment__info-title-date">{{ dateOfCreate }}</span>
        <transition name="toggle-content">
          <span v-show="edited" class="comment__info-title-status">
            {{ $t("common.comments.changed") }}
          </span>
        </transition>
      </span>
      <transition name="toggle-content" mode="out-in">
        <AppTextarea
          v-if="editMode"
          key="textarea"
          :name="dateOfCreate"
          v-model="messageValue"
          :max="Length.TEXTAREA"
          :min="Length.TEXT"
        />
        <p v-else key="text" class="comment__info-message">{{ commentMessage }}</p>
      </transition>
      <div class="comment__info-actions">
        <EmojiPicker @add-emoji="addEmoji" />
        <div class="comment__info-actions--scrolled">
          <span class="reactions">
            <span
              v-for="(emoji, index) in commentEmoji"
              :key="emoji.smile"
              @click="emojiAction(index, emoji as Required<IEmoji>)"
              class="comment__info-actions-smile"
              :class="{ active: emoji.authors?.includes(unicID) }"
            >
              {{ emoji.smile }} {{ emoji.authors?.length }}
            </span>
          </span>
          <span class="comment__info-actions-edit" v-if="authorCurrentUser">
            <span class="edit-action" @click="deleteCommentPopup">{{
              $t("common.comments.commentEditor.delete")
            }}</span>
            <span class="edit-action" @click="toggleEditMode">{{ editModeTitle }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { ArrayHasValues, NewObjectLink, OpenPopup } from "@/helpers/methods";

import i18n from "@/i18n";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useDateParseToString from "@/composables/useDateParse";
import Avatar from "../user/AppAvatar.vue";
import EmojiPicker from "../UI/EmojiPicker.vue";

import type { PropType } from "vue";
import { Colors, Length } from "@/types/enums";
import type { IEmoji, INewEmojiParams, ITaskComment } from "@/types/interfaces/board";

export default defineComponent({
  props: {
    comment: {
      type: Object as PropType<ITaskComment>,
      required: true,
    },
    commentMessage: {
      type: String,
      required: true,
    },
    commentEmoji: {
      type: Array as PropType<Required<IEmoji[]>>,
      default: () => [],
    },
    edited: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Avatar,
    EmojiPicker,
  },
  emits: ["update:comment-message", "update:comment-emoji", "update:edited", "deleteComment"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const { getFullName, unicID } = useCurrentUserInfo();

    const member = ref(props.comment.member);

    const editMode = ref(false);

    const editedMessage = ref(props.edited);

    const messageValue = ref(props.commentMessage);

    const editModeTitle = computed(() => {
      const editModeName = editMode.value ? "save" : "edit";

      return t(`common.comments.commentEditor.${editModeName}`);
    });

    const toggleEditMode = () => {
      if (editMode.value && messageValue.value.length < Length.TEXT) {
        return;
      } else {
        editMode.value = !editMode.value;
        if (!editMode.value) {
          // Edited.
          if (messageValue.value !== props.commentMessage) {
            editedMessage.value = true;
            emit("update:edited", editedMessage.value);
          }

          emit("update:comment-message", messageValue.value);
        }
      }
    };

    const deleteCommentPopup = () => {
      OpenPopup({
        title: t("popup.deleteComment.title"),
        buttons: {
          yes: {
            text: t("buttons.delete"),
            color: Colors.DANGER,
          },
        },
        callback: () => {
          emit("deleteComment", props.comment.id);
        },
      });
    };

    const addEmoji = (params: INewEmojiParams) => {
      const commentEmoji = NewObjectLink(props.commentEmoji) ?? [];
      const foundEmoji = commentEmoji.find((item) => item.smile === params.emoji.smile);

      if (foundEmoji) {
        // If this emoticon has already been added by the current user.
        if (foundEmoji.authors?.includes(params.newAuthor)) {
          return;
        } else {
          foundEmoji.authors?.push(params.newAuthor);
        }
      } else {
        const newEmoji = params.emoji;
        newEmoji.authors = [params.newAuthor];

        commentEmoji.push(newEmoji);

        emit("update:comment-emoji", commentEmoji);
      }
    };

    const dateOfCreate = useDateParseToString(props.comment.dateOfCreate);

    const authorCurrentUser = computed((): boolean => {
      return props.comment.member.uid === unicID.value;
    });

    const emojiAction = (index: number, emoji: Required<IEmoji>): void => {
      if (emoji.authors.includes(unicID.value)) {
        const myAuthorshipIndex = emoji.authors.findIndex((id) => id === unicID.value);

        if (myAuthorshipIndex !== -1) {
          emoji.authors.splice(myAuthorshipIndex, 1);
        }
      } else {
        emoji.authors.push(unicID.value);
      }

      if (!ArrayHasValues(emoji.authors)) {
        props.commentEmoji.splice(index, 1);
      }

      emit("update:comment-emoji", props.commentEmoji);
    };

    return {
      editMode,
      member,
      Length,
      messageValue,
      dateOfCreate,
      unicID,
      editModeTitle,
      authorCurrentUser,
      addEmoji,
      emojiAction,
      deleteCommentPopup,
      toggleEditMode,
      getFullName,
    };
  },
});
</script>

<style lang="scss" scoped>
.comment {
  width: 100%;
  padding-left: 25px;

  &__info {
    position: relative;
    display: flex;
    flex-direction: column;

    .avatar {
      position: absolute;
      left: -25px;
    }

    &-title {
      width: 100%;
      display: inline-block;
      overflow-x: auto;
      white-space: nowrap;
      color: var(--color-text);
      padding: 0 2px;

      &-date {
        font-size: 13px;
        font-style: italic;
      }

      &-status {
        font-style: italic;
        margin-left: 10px;
        font-size: 12px;
      }

      &::-webkit-scrollbar {
        height: 2px;
      }

      &::-webkit-scrollbar-track {
        background-color: var(--color-scroll-track-invert);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-scroll-track);
      }
    }

    &-message {
      width: 100%;
      background-color: var(--color-background-secondary);
      box-shadow: 0 0 1px $color-dark-blue2;
      color: var(--color-text);
      padding: 10px;
      font-size: 14px;
      line-height: 24px;
      border-radius: 5px;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .c-textarea {
      height: 150px;
    }

    &-actions {
      display: flex;
      gap: 5px;
      margin-top: 5px;

      &--scrolled {
        display: inline-flex;
        gap: 5px;
        margin-right: 5px;
        height: 37px;
        padding: 0 5px 5px 0;
        overflow-y: auto;

        &::-webkit-scrollbar {
          height: 3px;
        }

        &::-webkit-scrollbar-track {
          background-color: var(--color-scroll-track-invert);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--color-scroll-track);
        }
      }

      .reactions {
        display: inline-flex;
        align-items: center;
        gap: 5px;
      }

      .add-new {
        padding: 0 7px;
        height: 30px;
      }

      &-smile {
        cursor: pointer;
        user-select: none;
        display: inline-block;
        white-space: nowrap;
        cursor: pointer;
        color: var(--color-text);
        padding: 2.5px 4px;
        border-radius: 15px;
        height: 30px;
        background-color: rgba($color-light-blue, 0.4);
        transition: background-color 0.2s;

        &.active {
          background-color: $color-blue;
          color: $color-white1;
        }
      }

      &-edit {
        display: inline-flex;
        align-self: center;
        gap: 12px;

        .edit-action {
          position: relative;
          cursor: pointer;
          font-size: 12px;
          color: var(--color-text);
          border-bottom: 1px solid;
          transition: color 0.2s;

          &::after {
            content: "";
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: -8px;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background-color: var(--color-text);
          }

          &:hover {
            color: $color-blue;
          }

          &:last-child {
            &::after {
              display: none;
            }
          }
        }
      }
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
