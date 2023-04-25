<template>
  <span
    class="user-avatar" 
    :style="avatarStyles"
    :class="{'user-avatar--circle': circle }"
  >
    <Loader v-if="showPreload" inline :size="30" />
    <img 
      v-else-if="avatar.url" 
      :src="avatar.url"
      alt=""
    /> 
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
    const avatarStyles = computed((): CSSProperties => {
      return {
        width: `${props.size}px`,
        minWidth: `${props.size}px`,
        height: `${props.size}px`,
        backgroundColor: props.avatar.bgAvatar
      }
    });

    const initials = computed((): string | null => {
      if(props.firstName) {
        const firstNameInitial = props.firstName[0].toUpperCase();
        const lastNameInitial = props.lastName[0].toUpperCase() ?? "";
        
        return firstNameInitial + lastNameInitial;
      }

      return null;
    });

    const showPreload = computed(() => (!initials && !props.avatar.url) ||
                                               (!props.avatar.bgAvatar && !props.noBackgrond))

    const imgLoad = (): boolean => imgLoaded.value = true;
    const imgLoaded = ref(false);

    const sizeInitials = computed((): string => `font-size: ${ props.size / 2.2 }px;`);

    return {
      avatarStyles,
      imgLoaded,
      initials,
      sizeInitials,
      showPreload,
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
  border-radius: 4px;
  color: $color-black;
  background-color: $color-dark-grey4;
  .c-loader {
    position: static !important;
  }
  &.user-avatar--circle {
    border-radius: 50%;
    img {
      border-radius: 50%;
    }
  }
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
