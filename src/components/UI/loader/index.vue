<template>
  <div 
    class="c-loader"
    :class="{ 'inline-transparent': inline }"
  >
    <div class="c-loader__spinner">
      <svg viewBox="-3 -4 39 39">
        <polygon
          fill="transparent"
          strokeWidth="1"
          points="16,0 32,32 0,32"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    inline: {
      type: Boolean,
      default: false,
    }
  }
})
</script>

<style lang="scss" src="./index.scss"></style>