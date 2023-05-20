<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" />
    <div class="board-item-page__content" :style="{ background: boardBackground }">
      <cLoader v-if="!showedCommonLoader && !boardNotEmpty" />
      <transition name="toggle-content">
        <div v-if="boardNotEmpty" class="board-item-page__board-additional">
          <div class="avatars-wrapper">
            <template v-for="item in boardMembers" :key="item.uid">
              <Avatar
                v-if="!item.invited"
                :avatar="item.avatarParams"
                :first-name="item.firstName"
                :last-name="item.lastName"
                circle
              />
            </template>
          </div>
          <BtnInviteUsers :board="boardItem" @invited="setInviteUserToBoard" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import type {
  IUserForList,
  IWorkingBoardItem,
  IWorkingBoardMembers,
} from "@/types/interfaces";
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

    const boardItem = ref<IWorkingBoardItem>({} as IWorkingBoardItem);

    const boardMembers = ref<IUserForList[]>([]);

    const boardNotEmpty = computed((): boolean => {
      return ObjectNotEmpty(boardItem.value);
    });

    const boardBackground = computed((): string => {
      if (
        boardItem.value.background &&
        boardItem.value.background.match("dashboardTemplates")
      ) {
        return `url(${boardItem.value.background})`;
      }

      return boardItem.value.background;
    });

    const setInviteUserToBoard = (user: IWorkingBoardMembers): void => {
      boardItem.value.members.push(user);
      dashboardStore.updateWorkingBoard(boardItem.value, false);
    };

    onMounted((): void => {
      const joinCode = router.currentRoute.value.params.code as string;

      dashboardStore
        .getWorkingBoardItem(unicID.value, joinCode)
        .then((info) => {
          boardItem.value = info.value;
          boardMembers.value = info.members;
          console.log(boardItem.value);
        })
        .catch(() => {
          router.push({ name: "Dashboard" });
        });
    });

    return {
      boardNotEmpty,
      boardBackground,
      boardItem,
      boardMembers,
      userInfo,
      showedCommonLoader,
      setInviteUserToBoard,
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
      flex-direction: row-reverse;
      align-items: center;
      .user-avatar {
        margin-right: -10px;
        &:first-child {
          position: relative;
          margin-right: 0;
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            right: 0;
            display: inline-block;
            width: 12px;
            height: 12px;
            background-image: url(images/icons/crown.svg);
          }
        }
      }
    }
  }
}
</style>
