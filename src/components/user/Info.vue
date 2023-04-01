<template>
  <div class="user-info__name">
    <h5 class="user-info__name--first-name text-ellipsis">{{ name }}</h5>
    <small class="user-info__name--status" :class="{ 'verified': emailVerified }">
      <span :class="['mdi', statusIcon]"></span> 
      {{ userStatusText }}  
    </small>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { useStore } from "vuex";
import { Status, EmailVerify } from "@/types";

export default defineComponent({
  props: {
    status: {
      type: String as PropType<Status>,
      default: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    const emailVerified: boolean = store.getters.getCurrentUser.emailVerified;

    const userStatusText = computed((): EmailVerify => {
      if (emailVerified) return "Почта подтверждена"
      return "Почта не подтверждена"
    })

    const statusIcon: string = emailVerified ? "mdi-email-check" : "mdi-email-alert"

    return {
      statusIcon,
      emailVerified,
      userStatusText,
    }
  }
});
</script>

<style lang="scss" scoped>
.user-info__name {
  max-width: 140px;

  &--first-name {
    color: $color-white4;
    font-size: 14px;
    line-height: 21px;
    white-space: pre-wrap;
  }

  &--status {
    font-size: 11px;
    line-height: 16.5px;
    color: $color-yellow;

    &.verified {
      color: $color-green;
    }
  }
}
</style>
