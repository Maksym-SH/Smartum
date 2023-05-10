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
      <cSelect :items="actions" @selected="selected" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { useContainerProps } from './use/useProps'
import Avatar from './Avatar.vue'
import Info from './Info.vue'
import type { SelectElements } from '@/types/types'
import { Colors } from '@/types/enums'

import verifyEmail from '@/helpers/firebase/firebaseVerifyEmail'
import router from '@/router'
import useCurrentUserInfo from '@/composables/useCurrentUserInfo'
import useStores from '@/composables/useStores'

export default defineComponent({
  components: {
    Avatar,
    Info,
  },
  props: useContainerProps,
  emits: ['userMenuPicked'],
  setup(_, { emit }) {
    const { userStore } = useStores()

    const { currentUser } = useCurrentUserInfo()
    const emailVerified = computed(
      (): boolean => currentUser.value.emailVerified,
    )

    const actions = reactive<SelectElements>([
      {
        title: 'Мой профиль',
        callback: () => router.push('/profile'),
        icon: 'mdi-account',
        color: Colors.Default,
        displaying: true,
      },
      {
        title: 'Подтвердить адрес',
        callback: () => verifyEmail(currentUser.value),
        icon: 'mdi-email-check-outline',
        color: Colors.Info,
        displaying: computed(() => !emailVerified.value), // Not verified.
      },
      {
        title: 'Выйти с аккаунта',
        callback: () => {
          userStore.userLogout().then(() => {
            notify({
              title: 'До скорого!',
            })
          })
        },
        icon: 'mdi-logout',
        color: Colors.Danger,
        displaying: true,
      },
    ])

    const selected = (callback: Function): void => {
      emit('userMenuPicked')
      callback()
    }

    return {
      actions,
      emailVerified,
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
