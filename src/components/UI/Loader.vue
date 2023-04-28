<template>
  <div 
    class="c-loader" 
    :class="{ 'inline-transparent': inline }"
  >
    <div class="c-loader__spinner">
      <svg
        class="c-loader__spinner--animation"
        :style="loaderSize"
        viewBox="-3 -4 39 39">
        <polygon 
          class="c-loader__spinner-polygon"
          fill="transparent" 
          strokeWidth="1" 
          points="16,0 32,32 0,32" 
        />
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, reactive } from "vue";

export default defineComponent({
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 60
    }
  },
  setup(props) {
    const loaderSize: CSSProperties = reactive({
      width: `${props.size}px`,
      height: `${props.size}px`,
    });

    return {
      loaderSize
    }
  }
});
</script>

<style lang="scss" scoped>
.c-loader {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($color-black, 0.5);
  &:not(.inline-transparent) {
    width: 100%;
    height: 100vh;
  }
  &__spinner {
    &--animation {
      display: inline-block;
      transform-origin: 50% 65%;
      .c-loader__spinner-polygon {
        stroke: $color-blue;
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

// Loader animation.
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
