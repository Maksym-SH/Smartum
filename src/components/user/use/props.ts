import { PropType } from "vue"
import { IAvatarParams } from "@/interfaces";
// Avatar.vue
export const useAvatarProps = {
  avatar: {
    type: Object as PropType<IAvatarParams>,
    default: {
      url: "",
      bgAvatar: ""
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
  rounded: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  }
}

// Container.vue
export const useContainerProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: ""
  },
  avatar: {
    type: Object as PropType<IAvatarParams>,
    default: {
      url: "",
      bgAvatar: ""
    },
  },
}
// Info.vue
export const useInfoProps = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    default: ""
  }
}