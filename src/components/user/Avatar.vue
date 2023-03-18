<template>
  <span class="user-avatar" :style="avatarSize">
    <img
      v-show="imgLoaded && image"
      :src="image"
      @load="imgLoad"
      alt="Avatar"
    />
    <span
      class="user-avatar--initials"
      v-show="!imgLoaded || !image"
      :style="`font-size: ${size / 2.2}px;`"
    >
      {{ initials }}
    </span>
    <span v-if="online" class="user-avatar--online"> </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";

export default defineComponent({
  props: {
    image: {
      type: String,
      default: "",
    },
    online: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 42,
    },
    name: {
      type: String,
    },
  },
  setup(props) {
    const avatarSize = reactive({
      width: `${props.size}px`,
      height: `${props.size}px`,
    });
    const initials = computed(() =>
      props.name
        ?.split(" ")
        .map((item) => item[0])
        .join("")
    );

    const imgLoad = () => (imgLoaded.value = true);
    const imgLoaded = ref(false);

    return {
      avatarSize,
      imgLoaded,
      initials,
      imgLoad,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-avatar {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: $color-green-hover;
  border-radius: 4px;
  color: $color-black;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    user-select: none;
  }

  &--online {
    position: absolute;
    display: inline-block;
    width: 12px;
    height: 12px;
    bottom: 4px;
    right: -6px;
    border-radius: 50%;
    border: 2px solid $color-grey;
    background-color: $color-green;
  }
}
</style>
