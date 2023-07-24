<template>
  <div class="task-info-modal">
    <div class="task-info-modal__window">
      <div class="task-info-modal__window-inner">
        <template v-if="currentTask">
          <header class="task-info-modal__window-header">
            <AppButton
              variant="text"
              icon="close"
              class="task-info-modal__window--close"
              rounded
              @click="closeModal"
            />
            <div class="task-info-modal__window-header-title">
              <InlineSvg class="icon" src="/images/icons/task.svg" />
              <VTooltip :text="$t('task.editTitleTooltip')" location="top">
                <template #activator="{ props }">
                  <AppInput
                    v-bind="props"
                    ref="taskTitleRef"
                    v-model="editableTaskTitle"
                    :name="currentTask.title"
                    :max="Length.MAX"
                    :min="Length.TEXT"
                    @blur="saveTaskName"
                    @keyup.enter.exact="saveTaskName"
                  />
                </template>
              </VTooltip>
            </div>
            <p class="task-info-modal__window-header-description">
              {{ $t("modal.taskStatus") }}
              <span
                class="task-info-modal__window-header-description--underline"
                @click="showColumn"
              >
                {{ columnName }}
              </span>
            </p>
            <small class="task-info-modal__window-header-date">
              {{ $t("common.dateOfCreate") }} {{ dateSent }}
            </small>
            <div class="task-info-modal__window-actions">
              <div class="task-info-modal__window-action-item action">
                <span class="action__title">{{ $t("common.marks") }}</span>
                <div class="action__marks" :class="{ empty: noMarks }">
                  <BackgroundItem
                    v-for="mark in currentTask.marks"
                    :key="mark"
                    :width="40"
                    :height="36"
                    :background="mark"
                  />
                  <ModalColorPicker
                    v-if="showAddMarkBtn"
                    v-model="newMark"
                    theme="light"
                    :show-colors-target="false"
                    :regenerate="false"
                    :apply-button-color="false"
                    @selected="addNewMark"
                  >
                    <template #button-title>
                      <span class="select-color-btn">
                        <InlineSvg src="/images/icons/plus.svg" />
                      </span>
                    </template>
                  </ModalColorPicker>
                </div>
              </div>
              <div class="task-info-modal__window-action-item">
                <span class="action__title">{{
                  $t("navigation.notifications.title")
                }}</span>
                <VTooltip :text="$t('task.tooltip')" location="bottom">
                  <template #activator="{ props }">
                    <AppButton
                      v-bind="props"
                      icon="eye"
                      :color="Colors.LIGHT_GREY"
                      :title="$t('buttons.notificationSubscribe')"
                      @click="subscribe"
                    />
                  </template>
                </VTooltip>
              </div>
              <div class="task-info-modal__window-action-item">
                <span class="action__title">{{ $t("modal.members") }}</span>
                <MembersAssign
                  v-if="currentTask.assignedMembers"
                  :all-members="boardMembers"
                  :task-name="currentTask.title"
                  :assigned-members="currentTask.assignedMembers"
                  @assign-member="assignNewMember"
                />
              </div>
            </div>
          </header>
          <div class="task-info-modal__window-content">
            <div class="task-info-modal__window-content-description has-icon">
              <div class="action">
                <span class="action__title">
                  <InlineSvg class="icon" src="/images/icons/info-box-outline.svg" />
                  {{ $t("modal.description") }}
                </span>
                <transition name="toggle-content" mode="out-in">
                  <AppTextarea
                    v-if="editDescriptionMode"
                    key="textarea"
                    v-model.trim="descriptionText"
                    :max="Length.TEXTAREA"
                    name="taskDescription"
                    :placeholder="$t('labels.moreDetails')"
                    @blur="saveDescriptionText"
                    @keydown.enter.exact.prevent="saveDescriptionText"
                  />
                  <p
                    v-else
                    key="description"
                    class="action__decription"
                    @click="toggleEditDescriptionMode(true)"
                  >
                    {{ currentTask.description }}
                  </p>
                </transition>
              </div>
            </div>
            <div class="task-info-modal__window-content-subtasks has-icon">
              <div class="action">
                <span class="action__title">
                  <InlineSvg class="icon" src="/images/icons/info-box-outline.svg" />
                  {{ $t("modal.additionalTasks") }}
                </span>
                <SubtasksList
                  v-if="currentTask.subtasks"
                  v-model:subtasks="currentTask.subtasks"
                />
              </div>
            </div>
            <div class="task-info-modal__window-content-comments">
              <div class="action">
                <span class="action__title has-icon">
                  <InlineSvg class="icon" src="/images/icons/comment-account-outline.svg" />
                  {{ $t("common.comments.title") }}
                </span>
              </div>
              <NewComment
                v-if="currentTask.comments"
                :member="currentMember"
                :comments-size="currentTask.comments.length"
                @create-comment="createComment"
              />
              <transition-group
                tag="div"
                class="comment-items"
                name="smooth-height"
                mode="out-in"
              >
                <CommentItem
                  v-for="comment in currentTask.comments"
                  :key="comment.id"
                  v-model:comment-message="comment.message"
                  v-model:comment-emoji="comment.emoji"
                  v-model:edited="comment.edited"
                  :comment="comment"
                  @delete-comment="deleteComment"
                />
              </transition-group>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
import { ArrayHasValues } from "@/helpers/methods";

import i18n from "@/i18n";
import useTaskInfo from "@/composables/useTaskInfo";

import AppButton from "../UI/AppButton.vue";
import AppInput from "../UI/AppInput.vue";
import AppTextarea from "../UI/AppTextarea.vue";
import BackgroundItem from "../UI/BackgroundItem.vue";
import NewComment from "../comment/CommentAddNew.vue";
import CommentItem from "../comment/CommentItem.vue";
import MembersAssign from "../board/task/TaskAssign.vue";
import SubtasksList from "../board/task/subtask/SubtasksList.vue";
import ModalColorPicker from "./ModalColorPicker.vue";
import InlineSvg from "vue-inline-svg";
import { VTooltip } from "vuetify/components";

import { Colors, Length } from "@/types/enums";
import type { ITaskComment } from "@/types/interfaces/board";
import type { IUserForList } from "@/types/interfaces/user";

export default defineComponent({
  components: {
    AppButton,
    AppInput,
    AppTextarea,
    InlineSvg,
    ModalColorPicker,
    BackgroundItem,
    NewComment,
    CommentItem,
    MembersAssign,
    SubtasksList,
    VTooltip,
  },
  props: {
    taskId: {
      type: Number,
      required: true,
    },
    taskModalActive: {
      type: Boolean,
      required: true,
    },
    columnId: {
      type: Number,
      required: true,
    },
  },
  emits: ["update:taskModalActive", "showColumn"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const closeModal = (): void => {
      emit("update:taskModalActive", false);
    };

    const {
      currentTask,
      columnName,
      dateSent,
      editDescriptionMode,
      currentMember,
      boardMembers,
      editableTaskTitle,
      taskTitleRef,
      descriptionText,
      saveTaskName,
      toggleEditDescriptionMode,
      saveDescriptionText,
    } = useTaskInfo(props.columnId, props.taskId);

    // Marks actions.
    const newMark = ref("");

    const noMarks = computed((): boolean => {
      return !currentTask.value.marks || !ArrayHasValues(currentTask.value.marks);
    });

    const showAddMarkBtn = computed(() => {
      return currentTask.value.marks && currentTask.value.marks.length < 5;
    });

    const addNewMark = (): void => {
      if (currentTask.value.marks) {
        if (currentTask.value.marks.includes(newMark.value)) {
          notify({
            title: t("notify.tooManyTaskMarks.title"),
            text: t("notify.tooManyTaskMarks.text"),
          });
        } else {
          currentTask.value.marks.push(newMark.value);
        }
      }
    };

    // Task actions.
    const showColumn = (): void => {
      emit("showColumn");
      closeModal();
    };

    // Comment actions.
    const newComment = ref("");

    const createComment = (comment: ITaskComment): void => {
      currentTask.value.comments.unshift(comment);
    };

    const deleteComment = (id: number): void => {
      const commentIndexToDelete = currentTask.value.comments.findIndex(
        (comment) => comment.id === id
      );

      if (commentIndexToDelete !== -1) {
        currentTask.value.comments.splice(commentIndexToDelete, 1);
      }
    };

    // Members actions
    const assignNewMember = (member: IUserForList): void => {
      if (currentTask.value.assignedMembers) {
        currentTask.value.assignedMembers.push(member);
      }
    };

    // Notification actions. ToDo
    const subscribe = () => {
      notify({
        title: t("notify.development.title"),
        type: "success",
      });
    };

    return {
      Colors,
      noMarks,
      dateSent,
      columnName,
      newMark,
      currentTask,
      showAddMarkBtn,
      editDescriptionMode,
      Length,
      boardMembers,
      currentMember,
      newComment,
      descriptionText,
      editableTaskTitle,
      taskTitleRef,
      saveTaskName,
      deleteComment,
      createComment,
      addNewMark,
      assignNewMember,
      saveDescriptionText,
      toggleEditDescriptionMode,
      subscribe,
      showColumn,
      closeModal,
    };
  },
});
</script>

<style lang="scss" scoped>
.task-info-modal {
  position: fixed;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  background-color: $color-transp-black;
  width: 100%;
  height: 100%;
  padding: 15px;

  &__window {
    position: relative;
    height: fit-content;
    width: 100%;
    max-width: 750px;
    padding: 5px;
    background-color: var(--color-background-task);
    border-radius: 10px;

    &-inner {
      max-height: 94vh;
      overflow: hidden auto;

      &::-webkit-scrollbar {
        width: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: var(--color-scroll-track-invert);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--color-scroll-track);
      }
    }

    &-header {
      display: flex;
      flex-direction: column;
      padding: 15px 40px 10px 28px;

      &-title {
        position: relative;
        font-size: 18px;
        color: var(--color-text);

        .c-input {
          max-width: 480px;
          padding: 0 10px 15px 0;
          height: 30px;

          :deep(.c-input__field) {
            padding: 0;
            border-color: transparent;
          }
        }
      }

      &-date {
        color: var(--color-text);
        margin-top: 10px;
      }

      &-description {
        font-size: 14px;
        margin-top: 15px;
        color: var(--color-text);

        &--underline {
          cursor: pointer;
          font-style: italic;
          text-decoration: underline;
          text-underline-offset: 5px;
        }
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      padding: 8px;
      margin-top: 10px;

      &-description {
        margin-top: 10px;
      }

      .has-icon {
        padding-left: 20px;

        .icon {
          position: absolute;
          top: 8px;
          left: -22px;
          width: 18px;
        }
      }

      span.has-icon {
        .icon {
          left: -2px;
        }
      }

      &-comments {
        margin-top: 20px;

        .new-comment {
          margin-top: 5px;
        }

        .comment-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 15px;
        }
      }
    }

    &-actions {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -22px;
      width: 18px;
    }

    .action {
      &__title {
        position: relative;
        color: var(--color-text);
        font-style: italic;
        font-size: 13px;
      }

      &__marks {
        display: inline-flex;
        align-items: center;
        gap: 5px;

        .image-example {
          cursor: inherit;
        }

        :deep(.color-picker) {
          max-width: 30px !important;

          .color-picker--open-modal {
            color: $color-black;
            height: 36px;
            padding: 2px;

            svg {
              width: 30px;
              height: 30px;
            }
          }
        }

        &.empty {
          :deep(.color-picker) {
            max-width: 50px !important;
          }
        }

        .select-color-btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          color: $color-black;

          svg {
            width: 20px;
            height: 20px;
          }
        }
      }

      .c-textarea {
        height: 122px;
        font-size: 18px;
        line-height: 20px;
        padding: 0;
      }

      &__decription {
        white-space: pre-wrap;
        word-break: break-word;
        cursor: pointer;
        width: 100%;
        font-size: 18px;
        line-height: 20px;
        color: var(--color-text);
        height: 122px;
        overflow-y: auto;

        &::-webkit-scrollbar {
          width: 5px;
        }

        &::-webkit-scrollbar-track {
          background-color: var(--color-scroll-track-invert);
        }

        &::-webkit-scrollbar-thumb {
          background-color: var(--color-scroll-track);
        }
      }
    }

    &-action-item {
      display: inline-flex;
      flex-direction: column;

      .c-button {
        text-transform: none;
      }
    }

    &--close {
      position: absolute;
      z-index: 2;
      top: 15px;
      right: 15px;
      width: 35px;
      height: 35px;
      font-size: 25px;
      color: var(--color-text) !important;
    }
  }

  @include mobile(max) {
    padding: 0;

    &__window {
      border-radius: 0;
      height: 100%;

      &-header {
        padding-left: 20px;
      }

      &-content {
        &-description {
          .action__decription {
            height: 80px;
            font-size: 14px;
          }

          .c-textarea {
            height: 80px !important;

            &:deep(.c-textarea__field) {
              font-size: 14px;
            }
          }
        }
      }

      &-inner {
        padding: 0px 10px 10px;
        max-height: 100%;

        &::-webkit-scrollbar {
          width: 1px;
        }
      }

      &-content {
        padding: 0 5px 0 0;
      }
    }
  }

  @include responsive($us, max) {
    .has-icon {
      padding-left: 0;
    }

    .icon {
      display: none;
    }

    &__window {
      &-header {
        padding: 0;

        &-title {
          width: 85%;
        }
      }
      &-inner {
        padding-top: 15px;
      }
      &-content {
        &-comments {
          .comment-items {
            margin-top: 10px;

            .comment {
              :deep(.comment__info) {
                .avatar {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }

  @include responsive($tiny, max) {
    &__window {
      &-header {
        padding-top: 7px;
      }
      &-inner {
        padding: 7px 2px 2px;
      }
    }
  }
}
</style>
