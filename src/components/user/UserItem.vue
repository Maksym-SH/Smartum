<template>
  <div class="user-item" :class="{ 'showed-more': showedAdditionalInfo }">
    <div class="user-item__common">
      <div class="user-item__jeneral-info">
        <div class="user-item__avatar">
          <Avatar
            circle
            :size="40"
            :first-name="userInfo.firstName"
            :last-name="userInfo.lastName"
            :avatar="userInfo.avatarParams"
          />
        </div>
        <div class="user-item__info">
          <h3 class="user-item__info-first-name text-ellipsis">
            {{ userInfo.firstName }}
          </h3>
          <h3 class="user-item__info-last-name text-ellipsis">
            {{ userInfo.lastName }}
          </h3>
        </div>
      </div>
      <div class="user-item__additional">
        <span v-if="userInfo.role" class="user-item__additional-role">
          {{ userInfo.role }}
        </span>
        <cButton
          v-if="!userInfo.role"
          @click="$emit('invite')"
          variant="text"
          class="user-item__additional--add"
        >
          <span class="mdi mdi-account-plus"></span>
        </cButton>
        <span
          @click="toggleDisplayAdditionalInfo"
          class="show-more"
          :class="{ open: showedAdditionalInfo }"
        >
          <span class="mdi mdi-chevron-down"></span>
        </span>
      </div>
    </div>

    <transition name="toggle-user-info">
      <div v-show="showedAdditionalInfo" class="user-item__more-info">
        <div class="info-item">
          <h5 class="info-item__name">
            <span class="mdi mdi-phone-outline"></span>
            Телефон
          </h5>
          <a
            v-if="userInfo.phone"
            :href="`tel:${userInfo.phone}`"
            class="info-item__description"
            >{{ userInfo.phone }}
          </a>
          <span v-else class="info-item__description"> Нет данных </span>
        </div>
        <div class="info-item">
          <h5 class="info-item__name">
            <span class="mdi mdi-information-outline"></span>
            О себе
          </h5>
          <span v-if="userInfo.about" class="info-item__description about">
            {{ userInfo.about }}
          </span>
          <span v-else class="info-item__description"> Нет данных </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import type { IUserForList } from "@/types/interfaces";

import Avatar from "./Avatar.vue";

export default defineComponent({
  components: {
    Avatar,
  },
  props: {
    userInfo: {
      type: Object as PropType<IUserForList>,
      required: true,
    },
  },
  emits: ["invite"],
  setup() {
    const showedAdditionalInfo = ref(false);

    const toggleDisplayAdditionalInfo = () => {
      showedAdditionalInfo.value = !showedAdditionalInfo.value;
    };
    return {
      showedAdditionalInfo,
      toggleDisplayAdditionalInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-item {
  position: relative;
  padding: 5px;
  margin: 5px;
  border-radius: 10px;
  min-height: 52px;
  transition: min-height 0.3s ease;
  background: linear-gradient(
    90deg,
    rgba($color-black, 0) 0%,
    rgba($color-dark-blue, 0.2) 100%
  );
  &.showed-more {
    min-height: 170px;
  }
  &__common {
    display: flex;
    justify-content: space-between;
  }
  &__jeneral-info {
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
  &__additional {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;
    color: var(--color-text);
    &-role {
      font-size: 13px;
    }
    &--add {
      padding: 6px;
      font-size: 20px;
    }
    .show-more {
      font-size: 25px;
      cursor: pointer;
      color: var(--color-text);
      transition: all 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }
  }
  &__more-info {
    position: absolute;
    top: 50px;
    padding: 5px 18px 7px 18px;
    .info-item {
      margin-top: 5px;
      display: inline;
      width: 100%;
      line-height: 15px;
      &__name {
        display: inline;
        font-weight: 500;
        user-select: none;
        font-size: 14px;
        color: var(--color-text);
        white-space: nowrap;
      }
      &__description {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        margin-top: 3px;
        font-size: 12px;
        color: $color-blue;
        word-break: break-all;
        user-select: none;
        max-height: 70px;
      }
    }
  }
  @include mobile(max) {
    margin: 5px 0;
    &__jeneral-info {
      gap: 8px;
    }
    &__info {
      width: 110px;
      &-first-name,
      &-last-name {
        font-size: 13px;
      }
    }
    &__additional {
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
  transform: translateY(-100%);
}
</style>
