<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" />
    <div class="board-item-page__content" :style="{ background: boardBackground }">
      <cLoader v-if="!showedCommonLoader && !boardNotEmpty" />
      <transition name="toggle-content">
        <div v-if="boardNotEmpty" class="board-item-page__board-additional">
          <div class="avatars-wrapper">
            <Avatar
              v-for="item in (boardItem as IWorkingBoardItem).members"
              :key="item.uid"
              :avatar="item.avatarParams"
              :first-name="item.firstName"
              :last-name="item.lastName"
              circle
            />
          </div>
          <BtnInviteUsers :board="boardItem" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type { IWorkingBoardItem } from "@/types/interfaces";
import { ObjectNotEmpty } from "@/helpers/methods";

import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import BoardHeader from "@/components/dashboard/BoardPageHeader.vue";
import BtnInviteUsers from "@/components/user/InviteBtn.vue";
import Avatar from "@/components/user/Avatar.vue";

export default defineComponent({
  components: {
    BoardHeader,
    Avatar,
    BtnInviteUsers,
  },
  setup() {
    const router = useRouter();

    const { commonStore, dashboardStore } = useStore();

    const showedCommonLoader = computed((): boolean => {
      return commonStore.loadingStatus;
    });

    const { unicID, userInfo } = useCurrentUserInfo();

    const boardItem = ref<IWorkingBoardItem | {}>({});

    const boardNotEmpty = computed((): boolean => {
      return ObjectNotEmpty(boardItem.value);
    });

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
      boardNotEmpty,
      boardBackground,
      boardItem,
      userInfo,
      showedCommonLoader,
    };
  },
});
</script>

<style lang="scss" scoped>
.board-item-page {
  height: 100%;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto 1fr;
  &__content {
    width: 100%;
    background-repeat: no-repeat !important;
    background-size: cover !important;
    background-position: center center !important;
  }
  &__board-additional {
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgba($color-black, 0.2);
    box-shadow: 0 10px 10px rgba($color-black, 0.2);
    justify-content: flex-end;
    .avatars-wrapper {
      display: flex;
      align-items: center;
      .user-avatar {
        margin-right: -10px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
