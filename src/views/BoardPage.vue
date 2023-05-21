<template>
  <div class="board-item-page">
    <BoardHeader :user-info="userInfo" @board-leave="boardLeave" />
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
                :class="{ admin: item.role === 'Администратор' }"
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
  IWorkingBoardMember,
} from "@/types/interfaces";
import { ObjectNotEmpty, OpenPopup } from "@/helpers/methods";
import { Colors } from "@/types/enums";

import useStore from "@/composables/useStores";
import useCurrentUserInfo from "@/composables/useCurrentUserInfo";
import BoardHeader from "@/components/dashboard/BoardPageHeader.vue";
import BtnInviteUsers from "@/components/user/InviteBtn.vue";
import Avatar from "@/components/user/Avatar.vue";
import { notify } from "@kyvg/vue3-notification";

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

    const setInviteUserToBoard = (user: IWorkingBoardMember): void => {
      boardItem.value.members.push(user);
      dashboardStore.updateWorkingBoard(boardItem.value, false);
    };

    const boardLeave = () => {
      const currentMember = boardItem.value.members.find(
        (member) => member.uid === unicID.value
      );
      if (currentMember) {
        OpenPopup({
          title: "Выйти из рабочего пространства?",
          text: leaveMessage(currentMember),
          buttons: {
            yes: {
              text: "Покинуть",
              color: Colors.Danger,
            },
          },
          callback: (): void => {
            dashboardStore.leaveWorkingBoard(currentMember, boardItem.value).then(() =>
              notify({
                title: "Вы успешно покинули рабочее пространство!",
                text: "Пространство было удалено из вашего списка рабочих досок.",
                type: "success",
              })
            );
          },
        });
      }
    };

    const leaveMessage = (currentMember: IWorkingBoardMember): string => {
      if (
        // Is Admin and members more than 1.
        currentMember.uid === boardItem.value.uid &&
        boardItem.value.members.length > 1
      ) {
        return "Вы являетесь администратором доски, если вы покинете рабочую доску, администратором станет первый приглашенный вами пользователь. Продолжить?";
      } else {
        // Is member.
        return "Вы можете снова присоединиться к доске если вам отправит приглашение один её участников.";
      }
    };

    onMounted((): void => {
      const joinCode = router.currentRoute.value.params.code as string;

      dashboardStore
        .getWorkingBoardItem(unicID.value, joinCode)
        .then((info) => {
          boardItem.value = info.value;
          boardMembers.value = info.members;
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
      boardLeave,
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
      align-items: center;
      .user-avatar {
        margin-left: -10px;
        &.admin {
          position: relative;
          &::after {
            content: "";
            position: absolute;
            top: -9px;
            left: 50%;
            transform: translateX(-50%);
            display: inline-block;
            width: 12px;
            height: 12px;
            background-image: url(/images/icons/crown.svg);
          }
        }
      }
    }
  }
}
</style>
