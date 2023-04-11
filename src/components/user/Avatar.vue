<template>
  <span
    class="user-avatar" 
    :style="avatarSize" 
    :class="{'user-avatar--rounded': rounded }"
  >
    <v-avatar 
      v-if="avatar" 
      :image="avatar" 
      :rounded="rounded" 
      :size="size"
    ></v-avatar> 
    <span
      class="user-avatar--initials"
      v-else-if="firstName"
      :style="sizeInitials"
    >
      {{ initials }}
    </span>
    <span 
      v-if="online" 
      class="user-avatar--online"
    ></span>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref, computed, CSSProperties } from "vue";
import { useAvatarProps } from "./use/props";

export default defineComponent({
  props: useAvatarProps,

  setup(props) {
    const avatarSize = computed((): CSSProperties => {
      return {
        width: `${props.size}px`,
        height: `${props.size}px`,
      }
    });

    const initials = computed((): string | null => {
      if(props.firstName) {
        const firstNameInitial = props.firstName[0];
        const lastNameInitial = props.lastName[0] ?? "";
        
        return firstNameInitial + lastNameInitial;
      }

      return null;
    });

    const imgLoad = (): boolean => imgLoaded.value = true;
    const imgLoaded = ref(false);

    const sizeInitials = computed((): string => `font-size: ${ props.size / 2 }px;`);

    return {
      avatarSize,
      imgLoaded,
      initials,
      sizeInitials,
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
  background-color: $color-brown;
  border-radius: 4px;
  color: $color-black;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    user-select: none;
  }
  &--initials {
    letter-spacing: 0.1px;
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
