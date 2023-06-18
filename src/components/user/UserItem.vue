<template>
  <details class="user-item">
    <summary class="user-item__summary">
      <div class="user-item__main-info">
        <div class="user-item__avatar">
          <Avatar
            circle
            :size="40"
            :first-name="user.firstName"
            :last-name="user.lastName"
            :avatar="user.avatarParams"
          />
        </div>
        <div class="user-item__info">
          <h3 class="user-item__info-first-name text-ellipsis">
            {{ user.firstName }}
          </h3>
          <h3 class="user-item__info-last-name text-ellipsis">
            {{ user.lastName }}
          </h3>
        </div>
      </div>
      <div class="user-item__actions">
        <span v-if="user.role" class="user-item__actions-role">
          {{ user.role }}
        </span>
        <span v-if="user.invited" class="user-item__actions--invited">
          <InlineSvg src="/images/icons/email-fast-outline.svg" />
          Приглашён
        </span>
        <AppButton
          v-else-if="!user.role"
          @click="$emit('invite')"
          variant="text"
          class="user-item__actions--add"
          icon="account-plus"
        />
        <span class="user-item__actions-caret">
          <InlineSvg src="/images/icons/chevron-down.svg" />
        </span>
      </div>
    </summary>
    <div class="user-item__details">
      <div class="info-item">
        <h5 class="info-item__name">
          <InlineSvg class="info-item__icon" src="/images/icons/phone-outline.svg" />
          Телефон
        </h5>
        <a
          v-if="user.phone"
          :href="`tel:${user.phone}`"
          class="info-item__description phone"
          >{{ user.phone }}
        </a>
        <span v-else class="info-item__description"> Нет данных </span>
      </div>
      <div class="info-item">
        <h5 class="info-item__name">
          <InlineSvg
            class="info-item__icon"
            src="/images/icons/information-outline.svg"
          />
          О себе
        </h5>
        <span v-if="user.about" class="info-item__description about">
          {{ user.about }}
        </span>
        <span v-else class="info-item__description"> Нет данных </span>
      </div>
    </div>
  </details>
</template>

<script lang="ts">
import { IUserForList } from "@/types/interfaces";
import { defineComponent, computed } from "vue";
import { useUserItemProps } from "./use/useProps";

import Avatar from "./AppAvatar.vue";
import InlineSvg from "vue-inline-svg";

export default defineComponent({
  components: {
    Avatar,
    InlineSvg,
  },
  props: useUserItemProps,
  emits: ["invite"],
  setup(props) {
    const user = computed(() => props.userInfo as IUserForList);

    return {
      user,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-item {
  position: relative;
  margin: 5px;
  border-radius: 10px;
  height: 57px;
  overflow: hidden;
  transition: height 0.3s ease;
  background: linear-gradient(
    90deg,
    rgba($color-black, 0) 0%,
    rgba($color-dark-blue, 0.2) 100%
  );

  &[open] {
    height: 175px;

    .user-item__actions-caret {
      transform: rotate(180deg);
      color: $color-blue;
    }
  }

  &__summary {
    display: flex;
    justify-content: space-between;
    padding: 5px;
    cursor: pointer;
    outline: none;
  }

  &__main-info {
    display: flex;
    gap: 10px;
  }

  &__info {
    color: var(--color-text);
    width: 137px;
    overflow-x: hidden;

    &-first-name,
    &-last-name {
      font-size: 14px;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    color: var(--color-text);
    min-height: 47px;

    &-role {
      font-size: 13px;
    }

    &--invited {
      display: inline-flex;
      align-items: flex-end;
      color: $color-dark-green;
      gap: 5px;
      font-size: 12px;

      svg {
        width: 18px;
      }
    }

    &--add {
      padding: 0 7px;
      font-size: 20px;
    }

    &-caret {
      display: inline-flex;
      align-items: center;
      color: var(--color-text);
      transition: all 0.2s;

      svg {
        width: 25px;
      }
    }
  }

  &__details {
    padding: 0 5px;

    .info-item {
      margin-top: 5px;
      width: 100%;
      line-height: 15px;

      &__icon {
        width: 18px;
      }

      &__name {
        display: inline-flex;
        gap: 6px;
        align-items: flex-end;
        font-weight: 500;
        user-select: none;
        font-size: 14px;
        color: var(--color-text);
        white-space: nowrap;
      }

      &__description {
        margin-top: 5px;
        font-size: 12px;
        user-select: none;

        &:not(.phone) {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          margin-top: 3px;
          color: $color-blue;
          word-break: break-all;
          max-height: 70px;
        }

        &.phone {
          display: block;
          width: fit-content;
        }
      }
    }
  }

  @include mobile(max) {
    margin: 5px 0;

    &__info {
      gap: 8px;
    }

    &__info {
      width: 110px;

      &-first-name,
      &-last-name {
        font-size: 13px;
      }
    }

    &__actions {
      gap: 5px;

      &-role {
        font-size: 12px;
      }
    }
  }
}

.toggle-user-info-enter-active,
.toggle-user-info-leave-active {
  transition: all 0.2s ease;
}
.toggle-user-info-enter-from,
.toggle-user-info-leave-to {
  opacity: 0;
  z-index: -1;
  transform: translateX(-100%);
}
</style>
