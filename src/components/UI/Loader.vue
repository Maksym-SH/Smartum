<template>
  <div class="c-loader" :class="{ 'inline-transparent': inline }">
    <div class="c-loader__spinner">
      <svg viewBox="-3 -4 39 39">
        <polygon fill="transparent" strokeWidth="1" points="16,0 32,32 0,32" />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.c-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  background-color: rgba($color-black, 0.5);

  &__spinner {
    svg {
      width: 60px;
      height: 60px;
      transform-origin: 50% 65%;
  
      polygon {
        stroke: $color-info;
        stroke-dasharray: 17;
        -webkit-animation: dash 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95)
          infinite;
        animation: dash 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
      }
    }
  }
 
  &.inline-transparent {
    position: static;
    background-color: transparent;
    display: inline;
  }
}

// Loader animation
@-webkit-keyframes dash {
  to {
    stroke-dashoffset: 136;
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 136;
  }
}

@-webkit-keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>
