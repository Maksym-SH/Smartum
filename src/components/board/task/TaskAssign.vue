<template>
  <div class="assigned-members">
    <div class="assigned-members__relative">
      <AppButton
        class="assigned-members__btn"
        icon="plus"
        :class="{ active: showWindowAssign }"
        @click="showWindowAssign = !showWindowAssign"
      />
      <DropdownWindow
        :visible="showWindowAssign"
        :centering="!notAssignedMembersExist"
        :width="250"
        :height="275"
        save-fix-height
      >
        <template #header>
          <div class="assigned-members__window-header">
            <h2 class="assigned-members__window-header-title">
              {{ $t("dropdown.assign") }}
            </h2>
            <AppButton
              class="assigned-members__window-header--close mobile-only"
              variant="text"
              icon="close"
              @click="showWindowAssign = false"
            />
          </div>
        </template>
        <template #content>
          <div class="assigned-members__window-content">
            <transition name="toggle-content" mode="out-in">
              <transition-group
                v-if="notAssignedMembersExist"
                key="members"
                tag="div"
                class="assigned-members__elements"
              >
                <template v-for="member in notAssignedMembers" :key="member.uid">
                  <div
                    v-if="!member.invited"
                    class="assigned-members__window-member-item member"
                  >
                    <div class="member__info">
                      <Avatar
                        class="member__avatar"
                        :size="30"
                        :first-name="member.firstName"
                        :last-name="member.lastName"
                        :avatar="member.avatarParams"
                        circle
                      />
                      <div class="members__info-text">
                        <h5 class="member__info-title text-ellipsis">
                          {{ member.firstName }}
                        </h5>
                        <h5 class="member__info-title text-ellipsis">
                          {{ member.lastName }}
                        </h5>
                      </div>
                    </div>
                    <div class="member__actions">
                      <VTooltip :text="$t('buttons.assign')" location="bottom">
                        <template #activator="{ props }">
                          <AppButton
                            v-bind="props"
                            icon="clipboard-account-outline"
                            variant="text"
                            @click="assignMember(member)"
                          />
                        </template>
                      </VTooltip>
                    </div>
                  </div>
                </template>
              </transition-group>
              <span v-else key="empty-list" class="assigned-members__window--empty-list">
                <InlineSvg src="/images/icons/clipboard-account-outline.svg" />
                {{ $t("dropdown.assignReady") }}
              </span>
            </transition>
          </div>
        </template>
      </DropdownWindow>
    </div>
    <transition-group
      tag="div"
      class="assigned-members__avatars"
      name="toggle-content"
      mode="out-in"
    >
      <template v-for="member in assignedMembers" :key="member.uid">
        <Avatar
          v-if="membersIds.includes(member.uid)"
          class="avatar"
          circle
          :size="36"
          :first-name="member.firstName"
          :last-name="member.lastName"
          :avatar="member.avatarParams"
        />
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { ArrayHasValues, OpenPopup } from "@/helpers/methods";

import i18n from "@/i18n";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import useBoardMembersInfo from "@/composables/useBoardMembersInfo";

import DropdownWindow from "@/components/container/DropdownWindow.vue";
import Avatar from "@/components/user/AppAvatar.vue";
import AppButton from "@/components/UI/AppButton.vue";
import InlineSvg from "vue-inline-svg";
import { VTooltip } from "vuetify/components";

import type { PropType } from "vue";
import type { IUserForList } from "@/types/interfaces/user";

export default defineComponent({
  components: {
    DropdownWindow,
    Avatar,
    InlineSvg,
    AppButton,
    VTooltip,
  },
  props: {
    assignedMembers: {
      type: Array as PropType<IUserForList[]>,
      required: true,
    },
    allMembers: {
      type: Array as PropType<IUserForList[]>,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
  },
  emits: ["assignMember"],
  setup(props, { emit }) {
    const { t } = i18n.global;

    const { membersIds } = useBoardMembersInfo();

    const { getFullName } = useCurrentUserInfo();

    const showWindowAssign = ref(false);

    const notAssignedMembers = computed((): IUserForList[] => {
      return props.allMembers.filter((boardMember) => {
        const notAssigned = !props.assignedMembers.some(
          (assigned) => assigned.uid === boardMember.uid
        );

        return notAssigned && !boardMember.invited;
      });
    });

    const notAssignedMembersExist = computed((): boolean => {
      return ArrayHasValues(notAssignedMembers.value);
    });

    const assignMember = (member: IUserForList): void => {
      OpenPopup({
        title: t("popup.assignMemberToTask.title"),
        text: t("popup.assignMemberToTask.text", {
          member: getFullName(member),
          task: props.taskName,
        }),
        buttons: {
          yes: {
            text: t("buttons.assign"),
          },
        },
        callback: (): void => {
          showWindowAssign.value = false;
          emit("assignMember", member);
        },
      });
    };

    return {
      membersIds,
      showWindowAssign,
      notAssignedMembers,
      notAssignedMembersExist,
      assignMember,
    };
  },
});
</script>

<style lang="scss" scoped>
.assigned-members {
  display: inline-flex;
  align-items: center;

  &__relative {
    position: relative;
  }

  &__avatars {
    padding-left: 7px;
    display: inline-flex;
    margin-left: 5px;

    .avatar {
      margin-left: -7px;
    }
  }

  &__btn {
    font-size: 25px;
    width: 20px;
    color: $color-white1;

    &.active {
      filter: brightness(90%);

      &:deep(.c-button__icon) {
        transform: rotate(45deg);
      }
    }
  }

  &__window {
    &-header {
      color: var(--color-text);
      text-align: center;
    }

    &-content {
      .assigned-members__elements {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .member {
        display: flex;
        justify-content: space-between;

        &__info {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          height: 40px;

          &-title {
            width: 145px;
            color: var(--color-text);
            font-size: 13px;
            white-space: nowrap;
          }
        }

        &__actions {
          display: flex;
          align-items: center;
          .c-button {
            font-size: 18px;
          }
        }
      }
    }

    &--empty-list {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      font-size: 13px;
      color: var(--color-text);

      svg {
        width: 40px;
      }
    }
  }

  @include mobile(max) {
    :deep(.dropdown-window__header) {
      height: auto;
    }

    &__window-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 7px 8px 7px;

      &-title {
        font-size: 14px;
      }

      &--close {
        padding: 5px;
        color: var(--color-text) !important;
        font-size: 25px;
      }
    }
    &__window-content {
      padding: 5px;

      .member {
        padding-left: 0;

        &__info {
          &-title {
            width: 180px;
          }
        }

        &__actions {
          .c-button {
            padding: 5px 10px;
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
