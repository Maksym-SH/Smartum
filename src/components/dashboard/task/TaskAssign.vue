<template>
  <div class="assigned-members">
    <div class="assigned-members__relative">
      <cButton
        class="assigned-members__btn"
        icon="plus"
        color="info"
        :class="{ active: showWindowAssign }"
        @click="showWindowAssign = !showWindowAssign"
      />
      <DropdownWindow
        :visible="showWindowAssign"
        :centering="!notAssignedMembersExist"
        :width="280"
        :height="275"
      >
        <template #header>
          <div class="assigned-members__window-header">
            <h2 class="assigned-members__window-header-title">Добавить участников</h2>
            <cButton
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
                tag="div"
                class="assigned-members__elements"
                v-if="notAssignedMembersExist"
                key="members"
              >
                <div
                  v-for="member in notAssignedMembers"
                  :key="member.uid"
                  class="assigned-members__window-member-item member"
                >
                  <div class="member__info">
                    <Avatar
                      class="member__avatar"
                      :size="30"
                      :firstName="member.firstName"
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
                    <v-tooltip text="Назначить" location="bottom">
                      <template v-slot:activator="{ props }">
                        <cButton
                          v-bind="props"
                          @click="assignMember(member)"
                          icon="clipboard-account-outline"
                          variant="text"
                        />
                      </template>
                    </v-tooltip>
                  </div>
                </div>
              </transition-group>
              <span v-else class="assigned-members__window--empty-list" key="empty-list">
                <InlineSvg src="/images/icons/clipboard-account-outline.svg" />
                Все участники назначены!
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
      <Avatar
        v-for="member in assignedMembers"
        class="avatar"
        :key="member.uid"
        circle
        :size="36"
        :firstName="member.firstName"
        :last-name="member.lastName"
        :avatar="member.avatarParams"
      />
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import type { PropType } from "vue";
import { IUserForList } from "@/types/interfaces";

import InlineSvg from "vue-inline-svg";
import DropdownWindow from "@/container/DropdownWindow.vue";
import Avatar from "@/components/user/Avatar.vue";
import { ArrayHasValues } from "@/helpers/methods";

export default defineComponent({
  props: {
    assignedMembers: {
      type: Array as PropType<IUserForList[]>,
      required: true,
    },
    allMembers: {
      type: Array as PropType<IUserForList[]>,
      required: true,
    },
  },
  emits: ["assign-new-member"],
  components: {
    DropdownWindow,
    Avatar,
    InlineSvg,
  },
  setup(props, { emit }) {
    const showWindowAssign = ref(false);

    const notAssignedMembers = computed((): IUserForList[] => {
      return props.allMembers.filter(
        (boardMember) =>
          !props.assignedMembers.some((assigned) => assigned.uid === boardMember.uid)
      );
    });

    const notAssignedMembersExist = computed((): boolean => {
      return ArrayHasValues(notAssignedMembers.value);
    });

    const assignMember = (member: IUserForList): void => {
      showWindowAssign.value = false;
      emit("assign-new-member", member);
    };

    return {
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
          width: 145px;
          overflow: hidden;
          height: 40px;

          &-title {
            color: var(--color-text);
            font-size: 13px;
            white-space: nowrap;
          }
        }
      }
    }

    &--empty-list {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
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
      padding: 7px 0;

      &--close {
        margin-right: 7px;
        padding: 5px;
        color: var(--color-text) !important;
        font-size: 25px;
      }
    }
  }
}
</style>
