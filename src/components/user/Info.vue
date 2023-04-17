<template>
  <div class="user-info__name">
    <h5 class="user-info__name--name text-ellipsis">{{ firstName }}</h5>
    <h5 class="user-info__name--name text-ellipsis">{{ lastName }}</h5>
    <small class="user-info__name--status" :class="{ 'verified': emailVerified }">
      <span :class="['mdi', statusIcon]"></span> 
      {{ userStatusText }}
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { EmailVerify, StatusVueIcon } from "@/types";
import { useInfoProps } from "./use/props";

export default defineComponent({
  props: useInfoProps,
  setup(props) {
    const store = useStore();

    const emailVerified: boolean = store.state.User.currentUser.emailVerified;

    const userStatusText = computed((): EmailVerify => {
      if (emailVerified) return "Почта подтверждена"
      return "Почта не подтверждена"
    })

    const showStatusEmailTemplate = computed((): boolean => true)

    const statusIcon: StatusVueIcon = emailVerified ? "mdi-email-check" : "mdi-email-alert"

    return {
      statusIcon,
      emailVerified,
      showStatusEmailTemplate,
      userStatusText,
    }
  }
});
</script>

<style lang="scss" scoped>
.user-info__name {
  max-width: 140px;
  min-height: 66px;
  display: flex;
  flex-direction: column;
  &--name {
    color: $color-white4;
    font-size: 14px;
    line-height: 21px;
    white-space: pre-wrap;
  }
  &--status {
    margin-top: auto;
    font-size: 11px;
    line-height: 16.5px;
    color: $color-yellow;
    &.verified {
      color: $color-green;
    }
  }
}
</style>
