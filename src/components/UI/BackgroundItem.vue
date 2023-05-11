<template>
  <div
    class="image-example"
    :style="[size, { background }]"
    @click="selectExample"
  >
    <img v-if="image" :src="image" class="image-example__picture" alt="" />
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import type { CSSProperties, PropType } from 'vue'
import { defineComponent } from 'vue'
import type { Colors } from '@/types/enums'

export default defineComponent({
  props: {
    image: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 64,
    },
    height: {
      type: Number,
      default: 32,
    },
    background: {
      type: String as PropType<Colors | string>,
      default: '',
    },
  },
  emits: ['select'],
  setup(props, { emit }) {
    const size = computed((): CSSProperties => {
      return {
        width: `${props.width}px`,
        height: `${props.height}px`,
      }
    })

    const selectExample = (): void => {
      const emitTarget = props.background ? props.background : props.image
      emit('select', emitTarget)
    }

    return {
      size,
      selectExample,
    }
  },
})
</script>

<style lang="scss" scoped>
.image-example {
  max-width: 80px;
  border-radius: 4px;
  cursor: pointer;
  outline: 3px solid transparent;
  transform: all 0.5s;
  &.active {
    outline-color: $color-cyan;
    border-radius: 0px;
    .image-example__picture {
      border-radius: 0;
    }
  }
  &__picture {
    border-radius: 4px;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
