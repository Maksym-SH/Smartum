<template>
  <div class="board-item-page">
    <BoardHeader :board="boardItem" :user-info="userInfo" />
    <div class="board-item-page__content" :style="{ background: boardBackground }"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { IWorkingBoardItem } from "@/types/interfaces";

import BoardHeader from "@/components/dashboard/BoardPageHeader.vue";
import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import { computed } from "@vue/reactivity";

export default defineComponent({
  components: {
    BoardHeader,
  },
  setup() {
    const router = useRouter();

    const { dashboardStore } = useStore();

    const { unicID, userInfo } = useCurrentUserInfo();

    const boardItem = ref<IWorkingBoardItem | {}>({});

    const boardBackground = computed(() => {
      const board = boardItem.value as IWorkingBoardItem;

      if (board.background && board.background.match("dashboardTemplates")) {
        return `url(${board.background})`;
      }

      return board.background;
    });

    onMounted(() => {
      const joinCode = router.currentRoute.value.params.code as string;

      dashboardStore
        .getWorkingBoardItem(unicID.value, joinCode)
        .then((board) => {
          boardItem.value = board;
        })
        .catch(() => {
          router.push({ name: "Dashboard" });
        });
    });

    return {
      boardBackground,
      boardItem,
      userInfo,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-item-page {
  height: 100%;
  &__content {
    width: 100%;
    height: calc(100% - 66.4px);
    background-repeat: no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
}
</style>
