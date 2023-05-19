<template>
  <div class="c-hint" :class="`c-hint-variant--${variant}`">
    <span v-html="content"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useHintProps } from "./use/useProps";

export default defineComponent({
  props: useHintProps,
});
</script>

<style lang="scss" scoped>
.c-hint {
  animation: hint-floating 0.5s infinite alternate-reverse;
  position: absolute;
  white-space: nowrap;
  text-align: center;
  font-size: 11px;
  color: $color-white1;
  display: inline-block;
  padding: 5px;
  border-radius: 5px;
  &.c-hint-variant--info {
    background-color: $color-blue;
  }
  &.c-hint-variant--danger {
    background-color: $color-red;
  }
  &.c-hint-varinat--success {
    background-color: $color-green;
  }
  &::before {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    background-color: inherit;
    display: inline-block;
    width: 10px;
    border-radius: 0 0 5px 5px;
    height: 5px;
    transform: translateX(-50%);
  }
}

@keyframes hint-floating {
  from {
    transform: translateY(-2px);
  }

  to {
    transform: translateY(0);
  }
}
</style>
