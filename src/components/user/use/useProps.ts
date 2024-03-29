import type { PropType } from "vue";
import type { IPictureParams, IUserForList } from "@/types/interfaces/user";
import type { IWorkingBoardItem } from "@/types/interfaces/board";

// Avatar.vue
export const useAvatarProps = {
  avatar: {
    type: Object as PropType<IPictureParams>,
    default: {
      url: "",
      bgAvatar: "",
    },
  },
  online: {
    type: Boolean,
    default: false,
  },
  size: {
    type: Number,
    default: 42,
  },
  circle: {
    type: Boolean,
    default: false,
  },
  noBackground: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
};

// Container.vue
export const useContainerProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
  avatar: {
    type: Object as PropType<IPictureParams>,
    default: {
      url: "",
      bgAvatar: "",
    },
  },
};
// Info.vue
export const useInfoProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: "",
  },
};

// Invite.vue
export const useInviteProps = {
  board: {
    type: Object as PropType<IWorkingBoardItem>,
    required: true,
  },
};

// UserItem.vue
export const useUserItemProps = {
  userInfo: {
    type: Object as PropType<IUserForList>,
    required: true,
  },
  userInvited: {
    type: Boolean,
    default: false,
  },
};
