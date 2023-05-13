<template>
  <div class="board-item-page">
    <BoardHeader />
    <div class="board-item__content">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent /* , onMounted , ref */ } from 'vue'

/* import { useRoute } from 'vue-router' */
import BoardHeader from '@/components/board/BoardItemHeader.vue'

/* import useStore from '@/composables/useStores'
import type { IWorkingBoardItem } from '@/types/interfaces'
 */
export default defineComponent({
  components: {
    BoardHeader,
  },
  setup() {
    /*  const router = useRoute()
    const { userStore, commonStore, dashboardStore } = useStore()

    const boardItem = ref<IWorkingBoardItem | {}>({}) */

    /*  onMounted(() => {
      console.log(userStore.userInfo)
    }) */
  },
})
</script>

<style lang="scss" scoped>
div {
  color: red;
}
</style>
