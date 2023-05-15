<template>
  <div class="user-item">
    <div class="user-item__avatar">
      <Avatar
        circle
        :size="50"
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
    <div class="user-item__action">
      <span class="user-item__action--invite" @click="$emit('invite')">
        <span class="mdi mdi-account-plus"></span>
        Пригласить
      </span>
      <span class="user-item__action--show-info"> Информация </span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
  setup() {},
});
</script>

<style lang="scss" scoped>
.user-item {
  padding: 7px;
  display: flex;
  gap: 10px;
  background-color: red;
  margin: 5px;
  border-radius: 4px;
  background-color: var(--color-background-secondary);
  &__info {
    color: var(--color-text);
    width: 200px;
    overflow-x: hidden;
    &-first-name,
    &-last-name {
      font-size: 16px;
    }
  }
  &__action {
    display: flex;
    flex-direction: column;
    gap: 5px;
    &--invite {
      color: $color-blue;
      font-size: 14px;
      cursor: pointer;
      user-select: none;
      &:hover {
        color: $color-blue-hover;
      }
    }
    &--show-info {
      font-size: 15px;
      cursor: pointer;
      color: $color-green;
      &:hover {
        color: $color-green-hover;
      }
    }
  }
}
</style>
