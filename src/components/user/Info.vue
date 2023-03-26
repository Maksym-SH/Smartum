<template>
  <div class="user-info__name">
    <h5 class="user-info__name--first-name text-ellipsis">{{ name }}</h5>
    <small class="user-info__name--status">Super admin</small>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { Status } from "@/types";

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
});
</script>

<style lang="scss" scoped>
.user-info__name {
  max-width: 130px;

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
  }
}
</style>
