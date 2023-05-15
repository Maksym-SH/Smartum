<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" />
    <div class="board-item__content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { IWorkingBoardItem } from "@/types/interfaces";

import BoardHeader from "@/components/board/BoardItemHeader.vue";
import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";

export default defineComponent({
  components: {
    BoardHeader,
  },
  setup() {
    const router = useRouter();
    const { dashboardStore } = useStore();

    const { unicID, userInfo } = useCurrentUserInfo();

    const boardItem = ref<IWorkingBoardItem | {}>({});

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
      userInfo,
    };
  },
});
</script>

<style lang="scss" scoped></style>
