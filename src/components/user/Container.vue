<template>
  <div class="user-info">
    <Avatar
      online
      :first-name="firstName"
      :last-name="lastName"
      :avatar="avatar"
    />
    <div class="user-info__content">
      <Info :first-name="firstName" :last-name="lastName" />
      <cSelect :items="actions" rounded @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useContainerProps } from './use/useProps'
import Avatar from './Avatar.vue'
import Info from './Info.vue'
import useSelectActions from '@/composables/useSelectActions'

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  props: useContainerProps,
  emits: ['userMenuPicked'],
  setup(_) {
    const { actions, selected } = useSelectActions()

    return {
      actions,
      selected,
    }
  },
})
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  .user-avatar {
    margin-right: 16px;
  }
  &__content {
    position: relative;
    min-width: 137px;
    :deep(.c-select) {
      position: absolute;
      top: 2px;
      right: -30px;
      .c-button--round {
        img {
          width: 22px;
        }
      }
    }
  }
}
</style>
