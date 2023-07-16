<template>
  <span class="user-avatar" :style="avatarStyles" :class="{ 'user-avatar--circle': circle }">
    <VSkeletonLoader v-show="showSkeletonLoader" color="info" :height="size" :elevation="24" />
    <span v-show="showInitials" class="user-avatar--initials" :style="sizeInitials">
      {{ initials }}
    </span>
    <img
      v-show="showPhoto"
      class="user-avatar__picture"
      :src="avatar.url"
      alt=""
      @load="imageLoad"
      @error="$emit('failedLoad')"
    />
    <span v-show="online" class="user-avatar--online" />
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from "vue";
import { useAvatarProps } from "./use/useProps";

import useImageLoad from "@/composables/useImageLoad";

import { VSkeletonLoader } from "vuetify/labs/VSkeletonLoader";

import type { CSSProperties } from "vue";

export default defineComponent({
  components: {
    VSkeletonLoader,
  },
  props: useAvatarProps,
  emits: ["failedLoad"],
  setup(props) {
    const { imageLoaded, imageLoad } = useImageLoad();

    const initials = computed((): string | null => {
      if (props.firstName) {
        const firstNameInitial = props.firstName[0].toUpperCase();
        const lastNameInitial = props.lastName[0]?.toUpperCase() ?? "";

        return firstNameInitial + lastNameInitial;
      }

      return null;
    });

    const showSkeletonLoader = computed(
      () =>
        (!initials.value && !props.avatar.url) ||
        (!props.avatar.bgAvatar && !props.noBackground) ||
        (!imageLoaded.value && props.avatar.url)
    );

    const showInitials = computed(() => {
      return props.firstName && !showSkeletonLoader.value;
    });

    const showPhoto = computed(() => {
      return props.avatar.url && imageLoaded.value;
    });

    // Disable image loading when an image has been deleted.
    watch(
      () => props.avatar.url,
      (hasImage) => {
        if (!hasImage) {
          imageLoaded.value = false;
        }
      }
    );

    const avatarStyles = computed((): CSSProperties => {
      return {
        width: `${props.size}px`,
        minWidth: `${props.size}px`,
        height: `${props.size}px`,
        backgroundColor: props.avatar.url ? "transparent" : props.avatar.bgAvatar,
      };
    });

    const sizeInitials = computed((): string => `font-size: ${props.size / 2.2}px;`);

    return {
      avatarStyles,
      initials,
      sizeInitials,
      showSkeletonLoader,
      showPhoto,
      showInitials,
      imageLoaded,
      imageLoad,
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
  filter: none;

  .v-skeleton-loader {
    width: 100%;
    height: 100%;
    box-shadow: none !important;

    :deep(.v-skeleton-loader__bone) {
      border-radius: inherit;
      height: 100%;

      &::after {
        z-index: 0;
      }
    }
  }

  &.user-avatar--circle {
    border-radius: 50%;

    .v-skeleton-loader,
    .user-avatar__picture {
      border-radius: 50%;
    }
  }

  &__picture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    user-select: none;
  }

  &--initials {
    letter-spacing: 0.1px;
    user-select: none;
  }

  &--online {
    position: absolute;
    z-index: 2;
    bottom: 4px;
    right: -6px;
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid $color-grey;
    background-color: $color-green;
  }
}
</style>
